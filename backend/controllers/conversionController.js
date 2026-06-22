const { validationResult } = require('express-validator');
const Conversion = require('../models/Conversion');
const { uploadToCloudinary, uploadBufferToCloudinary } = require('../utils/cloudinary');
const { isPixoraLink } = require('../utils/isPixoraLink');
const { removeBackgroundFromUrl, removeBackgroundFromBuffer } = require('../utils/removeBg');

exports.convert = async (req, res, next) => {
  try {
    let sourceType = 'local';
    let sourceValue = '';
    let imageToUpload = null;

    const hasFile = req.file && req.file.buffer;
    const hasUrl = req.body.imageUrl && req.body.imageUrl.trim();

    if (!hasFile && !hasUrl) {
      return res.status(400).json({ error: 'Please provide an image file or an image URL' });
    }

    if (hasUrl) {
      const url = req.body.imageUrl.trim();
      sourceType = 'external';
      sourceValue = url;

      if (isPixoraLink(url)) {
        sourceType = 'already-universal';

        const conversion = await Conversion.create({
          user: req.user._id,
          originalSource: { type: 'already-universal', value: url },
          pixoraLink: url,
          thumbnailUrl: url,
          type: 'already-universal'
        });

        return res.json({
          pixoraLink: url,
          shortCode: conversion.shortCode,
          type: 'already-universal',
          conversion: {
            id: conversion._id,
            shortCode: conversion.shortCode,
            originalSource: url,
            pixoraLink: url,
            thumbnailUrl: url,
            type: 'already-universal',
            createdAt: conversion.createdAt
          }
        });
      }

      // External URL - download then upload to Cloudinary
      const axios = require('axios');
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      imageToUpload = Buffer.from(response.data);
    }

    if (hasFile) {
      sourceType = 'local';
      sourceValue = req.file.originalname || 'local file';
      imageToUpload = req.file.buffer;
    }

    if (!imageToUpload) {
      return res.status(400).json({ error: 'Could not process the image source' });
    }

    const cloudinaryResult = await uploadBufferToCloudinary(imageToUpload, {
      public_id: `pixora-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    });

    const pixoraLink = cloudinaryResult.secure_url;

    const conversion = await Conversion.create({
      user: req.user._id,
      originalSource: { type: sourceType, value: sourceValue },
      pixoraLink,
      thumbnailUrl: pixoraLink,
      type: 'converted'
    });

    res.json({
      pixoraLink,
      shortCode: conversion.shortCode,
      type: 'converted',
      conversion: {
        id: conversion._id,
        shortCode: conversion.shortCode,
        originalSource: sourceValue,
        pixoraLink,
        thumbnailUrl: pixoraLink,
        type: 'converted',
        createdAt: conversion.createdAt
      }
    });
  } catch (error) {
    if (error.response && error.response.status === 402) {
      return res.status(503).json({ error: 'Background removal is temporarily unavailable. Please try again later.' });
    }
    next(error);
  }
};

exports.removeBackground = async (req, res, next) => {
  try {
    let sourceType = 'local';
    let sourceValue = '';

    const hasFile = req.file && req.file.buffer;
    const hasUrl = req.body.imageUrl && req.body.imageUrl.trim();

    if (!hasFile && !hasUrl) {
      return res.status(400).json({ error: 'Please provide an image file or an image URL' });
    }

    let imageBuffer;

    if (hasUrl) {
      const url = req.body.imageUrl.trim();
      sourceType = 'external';
      sourceValue = url;

      imageBuffer = await removeBackgroundFromUrl(url);
    }

    if (hasFile) {
      sourceType = 'local';
      sourceValue = req.file.originalname || 'local file';
      imageBuffer = await removeBackgroundFromBuffer(req.file.buffer, req.file.originalname);
    }

    if (!imageBuffer) {
      return res.status(400).json({ error: 'Could not process the image source' });
    }

    const cloudinaryResult = await uploadBufferToCloudinary(imageBuffer, {
      public_id: `pixora-bg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    });

    const pixoraLink = cloudinaryResult.secure_url;

    const conversion = await Conversion.create({
      user: req.user._id,
      originalSource: { type: 'bg-removed', value: sourceValue },
      pixoraLink,
      thumbnailUrl: pixoraLink,
      type: 'bg-removed'
    });

    res.json({
      pixoraLink,
      shortCode: conversion.shortCode,
      type: 'bg-removed',
      conversion: {
        id: conversion._id,
        shortCode: conversion.shortCode,
        originalSource: sourceValue,
        pixoraLink,
        thumbnailUrl: pixoraLink,
        type: 'bg-removed',
        createdAt: conversion.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
