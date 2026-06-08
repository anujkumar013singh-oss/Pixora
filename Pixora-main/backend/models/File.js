const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  storageKey: {
    type: String, // GridFS file ID or S3 Key
    required: true,
  },
  publicUrl: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  expiresAt: {
    type: Date,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('File', fileSchema);
