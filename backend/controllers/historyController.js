const Conversion = require('../models/Conversion');

exports.getHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [conversions, total] = await Promise.all([
      Conversion.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Conversion.countDocuments({ user: req.user._id })
    ]);

    res.json({
      conversions: conversions.map(c => ({
        id: c._id,
        shortCode: c.shortCode,
        originalSource: c.originalSource,
        pixoraLink: c.pixoraLink,
        thumbnailUrl: c.thumbnailUrl,
        type: c.type,
        createdAt: c.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    next(error);
  }
};
