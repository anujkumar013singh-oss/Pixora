const express = require('express');
const router = express.Router();
const { getGridFsBucket } = require('../config/db');
const File = require('../models/File');
const mongoose = require('mongoose');

// GET /f/:shortId  — public, no auth, streams the actual file
router.get('/:shortId', async (req, res) => {
  try {
    const file = await File.findOne({ shortId: req.params.shortId });

    if (!file) {
      return res.status(404).send('File not found');
    }

    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).send('This link has expired');
    }

    const bucket = getGridFsBucket();
    if (!bucket) {
      return res.status(500).send('Storage unavailable');
    }

    // These headers make the browser RENDER the file, not download it
    res.set('Content-Type', file.mimeType);
    res.set('Content-Disposition', 'inline');
    res.set('Cache-Control', 'public, max-age=31536000');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Access-Control-Allow-Origin', '*');

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(file.storageKey)
    );

    downloadStream.on('error', (err) => {
      console.error('[PUBLIC] Stream error:', err.message);
      if (!res.headersSent) res.status(404).send('File data not found');
    });

    downloadStream.pipe(res);

    // Increment view count, non-blocking
    File.findByIdAndUpdate(file._id, { $inc: { downloadCount: 1 } }).catch(() => {});

  } catch (err) {
    console.error('[PUBLIC] Error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;