import { Injectable, signal } from '@angular/core';
import { ParameterName } from '../models/telemetry.model';
import { BASE_UNITS } from '../config/parameters.config';

const VELOCITY_IN_CM_PER_S: any = {
  'mm/s': 0.1,
  'cm/s': 1,
  'm/s': 100,
  'km/h': 27.7777778,
  'ft/s': 30.48,
};

const PRESSURE_IN_MBAR: any = {
  'Pa': 0.01,
  'kPa': 10,
  'mbar': 1,
  'bar': 1000,
  'psi': 68.9475729,
  'atm': 1013.25,
};

@Injectable({ providedIn: 'root' })
export class UnitConversionService {
  selectedUnits = signal<any>({
    velocity: BASE_UNITS.velocity,
    pressure: BASE_UNITS.pressure,
    temperature: BASE_UNITS.temperature,
  });

  setUnit(name: ParameterName, unit: string) {
    const updated = { ...this.selectedUnits() };
    updated[name] = unit;
    this.selectedUnits.set(updated);
  }

  convert(name: ParameterName, baseValue: number): number {
    const unit = this.selectedUnits()[name];
    return this.convertToUnit(name, baseValue, unit);
  }

  convertToUnit(name: ParameterName, baseValue: number, unit: string): number {
    if (name === 'velocity') {
      return (baseValue * VELOCITY_IN_CM_PER_S['cm/s']) / VELOCITY_IN_CM_PER_S[unit];
    }

    if (name === 'pressure') {
      return (baseValue * PRESSURE_IN_MBAR['mbar']) / PRESSURE_IN_MBAR[unit];
    }

    if (unit === '°F') {
      return (baseValue * 9) / 5 + 32;
    }
    if (unit === 'K') {
      return baseValue + 273.15;
    }
    return baseValue;
  }

  format(value: number): string {
    return value.toFixed(2);
  }
}
