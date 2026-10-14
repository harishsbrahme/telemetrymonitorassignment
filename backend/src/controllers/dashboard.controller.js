const store = require('../services/telemetry-store.service');

// Sends the dashboard data
function sendDashboard(req, res) {
  res.json(store.getDashboard());
}

module.exports = { sendDashboard };
