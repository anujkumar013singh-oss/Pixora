const mongoose = require('mongoose');
const crypto = require('crypto');

const conversionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  originalSource: {
    type: {
      type: String,
      enum: ['local', 'external', 'already-universal', 'bg-removed'],
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  pixoraLink: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  shortCode: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['converted', 'already-universal', 'bg-removed'],
    default: 'converted'
  }
}, { timestamps: true });

conversionSchema.pre('save', function (next) {
  if (!this.shortCode) {
    this.shortCode = crypto.randomBytes(4).toString('base64url');
  }
  next();
});

conversionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Conversion', conversionSchema);
