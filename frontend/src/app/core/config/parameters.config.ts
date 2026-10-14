import { ParameterName } from '../models/telemetry.model';

export const PARAMETER_NAMES: ParameterName[] = ['velocity', 'pressure', 'temperature'];

export const PARAMETER_TITLES = {
  velocity: 'Velocity',
  pressure: 'Pressure',
  temperature: 'Temperature',
};

export const BASE_UNITS = {
  velocity: 'cm/s',
  pressure: 'mbar',
  temperature: '°C',
};

export const BASE_VALUES = {
  velocity: 185.4,
  pressure: 1012,
  temperature: 36.8,
};

export const UNIT_LIST = {
  velocity: ['mm/s', 'cm/s', 'm/s', 'km/h', 'ft/s'],
  pressure: ['Pa', 'kPa', 'mbar', 'bar', 'psi', 'atm'],
  temperature: ['°C', '°F', 'K'],
};

export const GAUGE_RANGE = {
  velocity: { min: 0, max: 250 },
  pressure: { min: 800, max: 1200 },
  temperature: { min: 20, max: 55 },
};

export const STATUS_LIMITS = {
  warningPercent: 4,
  criticalPercent: 7,
};
