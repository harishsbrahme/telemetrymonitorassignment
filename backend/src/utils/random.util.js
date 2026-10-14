function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// Returns 1 or -1
function randomDirection() {
  return Math.random() < 0.5 ? -1 : 1;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

module.exports = { randomBetween, randomDirection, clamp, roundTo };
