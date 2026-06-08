const express = require('express');
const router = express.Router();
const { upload, getGridFsBucket } = require('../config/db');
const auth = require('../middleware/auth');
const File = require('../models/File');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const { Readable } = require('stream');

// ✅ Magic bytes detection — no file-type package needed, zero crash risk
function detectMimeType(buffer) {
  if (!buffer || buffer.length < 4) return null;
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF)
    return 'image/jpeg';
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47)
    return 'image/png';
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46)
    return 'application/pdf';
  return null;
}

// POST /api/files/upload
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log(`[UPLOAD] ${req.file.originalname} — ${req.file.size} bytes`);

    // Step 1: Detect real MIME type from magic bytes
    const detectedMime = detectMimeType(req.file.buffer);
    const allowedTypes  = ['image/jpeg', 'image/png', 'application/pdf'];
    const finalMimeType = detectedMime || req.file.mimetype;

    console.log(`[UPLOAD] Detected MIME: ${finalMimeType}`);

    if (!allowedTypes.includes(finalMimeType)) {
      return res.status(400).json({
        message: 'Invalid file type. Only JPEG, PNG, and PDF are allowed.',
      });
    }

    // Step 2: Get GridFS bucket
    const bucket = getGridFsBucket();
    if (!bucket) {
      console.error('[UPLOAD] GridFS bucket is null — MongoDB not ready');
      return res.status(500).json({
        message: 'Storage not ready. Please try again in a moment.',
      });
    }

    // Step 3: Stream buffer into GridFS
    const gridFilename   = `${nanoid(16)}-${req.file.originalname}`;
    const uploadStream   = bucket.openUploadStream(gridFilename, {
      contentType: finalMimeType,
    });
    const fileId = uploadStream.id;

    await new Promise((resolve, reject) => {
      Readable.from(req.file.buffer)
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve);
    });

    console.log(`[UPLOAD] Stored in GridFS — id: ${fileId}`);

    // Step 4: Save metadata to MongoDB
    const shortId   = nanoid(10);
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
    const publicUrl  = `${backendUrl}/f/${shortId}`;

    const file = new File({
      shortId,
      owner:        req.user._id,
      originalName: req.file.originalname,
      mimeType:     finalMimeType,
      size:         req.file.size,
      storageKey:   fileId.toString(),
      publicUrl,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      tags:      req.body.tags ? JSON.parse(req.body.tags) : [],
    });

    await file.save();
    console.log(`[UPLOAD] Saved metadata — shortId: ${shortId}`);

    // Step 5: Update user quota (non-fatal if fails)
    try {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { storageUsed: req.file.size },
      });
    } catch (e) {
      console.warn('[UPLOAD] Quota update skipped:', e.message);
    }

    console.log(`[UPLOAD] ✅ Done — ${publicUrl}`);
    res.status(201).json(file);

  } catch (err) {
    console.error('[UPLOAD] ❌ CRASH:', err.message);
    console.error(err.stack);
    res.status(500).json({
      message: 'Upload failed: ' + err.message,
    });
  }
});

// GET /api/files
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/files/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    const bucket = getGridFsBucket();
    if (bucket && file.storageKey) {
      try {
        await bucket.delete(new mongoose.Types.ObjectId(file.storageKey));
      } catch (e) {
        console.warn('[DELETE] GridFS remove skipped:', e.message);
      }
    }

    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: -file.size },
    });

    await file.deleteOne();
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;