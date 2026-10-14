const express = require('express');
const controller = require('../controllers/dashboard.controller');

const router = express.Router();

// GET /api/dashboard
router.get('/dashboard', controller.sendDashboard);

module.exports = router;
