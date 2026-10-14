const config = require('../config/telemetry.config');
const { formatTime, formatTimestamp } = require('../utils/time.util');

// Names are velocity, pressure, temperature
const names = Object.keys(config.parameters);

// Holds the current value and history of each parameter
const store = {};

names.forEach(function (name) {
  store[name] = {
    value: config.parameters[name].base,
    history: [],
  };
});

// Adds a new sample and keeps only the latest 100
function addSample(name, value) {
  store[name].value = value;
  store[name].history.push({
    time: formatTime(new Date()),
    value: value,
  });

  if (store[name].history.length > config.maxSamples) {
    store[name].history.shift();
  }
}

// Returns the latest value of one parameter
function getCurrentValue(name) {
  return store[name].value;
}

// Builds the response for /api/dashboard
function getDashboard() {
  const result = {
    timestamp: formatTimestamp(new Date()),
  };

  names.forEach(function (name) {
    result[name] = {
      value: store[name].value,
      unit: config.parameters[name].unit,
      history: store[name].history.slice(),
    };
  });

  return result;
}

module.exports = { names, addSample, getCurrentValue, getDashboard };
