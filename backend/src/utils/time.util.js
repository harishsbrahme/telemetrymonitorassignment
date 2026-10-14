function pad(n) {
  return String(n).padStart(2, '0');
}

// HH:mm:ss for history points
function formatTime(date) {
  return pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
}

// ISO string for the response timestamp
function formatTimestamp(date) {
  return date.toISOString();
}

module.exports = { formatTime, formatTimestamp };
