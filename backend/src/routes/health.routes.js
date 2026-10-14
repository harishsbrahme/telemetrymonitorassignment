const express = require('express');

const router = express.Router();

// GET /api/health
router.get('/health', function (req, res) {
  res.json({ status: 'ok' });
});

module.exports = router;
