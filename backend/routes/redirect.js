const express = require('express');
const router = express.Router();
const Conversion = require('../models/Conversion');

router.get('/:shortCode', async (req, res, next) => {
  try {
    const conversion = await Conversion.findOne({ shortCode: req.params.shortCode });
    if (!conversion) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.redirect(301, conversion.pixoraLink);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
