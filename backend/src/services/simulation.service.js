const config = require('../config/telemetry.config');
const store = require('./telemetry-store.service');
const { randomBetween, randomDirection, clamp, roundTo } = require('../utils/random.util');

// Counts how many updates happened
let tickCount = 0;

// Finds the next value for one parameter
function getNextValue(name, currentValue) {
  const base = config.parameters[name].base;

  // Random step up or down
  const stepPercent = randomBetween(config.stepPercentMin, config.stepPercentMax);
  const step = (base * stepPercent) / 100;
  let newValue = currentValue + randomDirection() * step;

  // After every 5 updates, move back toward the base value
  if (tickCount % config.returnEveryTicks === 0) {
    newValue = newValue + (base - newValue) * config.returnFraction;
  }

  // Never go more than 10% away from base
  const maxChange = (base * config.maxDeviationPercent) / 100;
  newValue = clamp(newValue, base - maxChange, base + maxChange);

  return roundTo(newValue, 2);
}

// One update for all parameters
function tick() {
  tickCount = tickCount + 1;

  store.names.forEach(function (name) {
    const currentValue = store.getCurrentValue(name);
    const newValue = getNextValue(name, currentValue);
    store.addSample(name, newValue);
  });
}

// Runs one update now, then one every second forever
function startSimulation() {
  tick();
  setInterval(tick, config.tickIntervalMs);
}

module.exports = { startSimulation };
