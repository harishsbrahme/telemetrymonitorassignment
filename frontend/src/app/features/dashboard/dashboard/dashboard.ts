import { Component, OnInit, inject } from '@angular/core';
import { TelemetryService } from '../../../core/services/telemetry.service';
import { UnitConversionService } from '../../../core/services/unit-conversion.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ExportService } from '../../../core/services/export.service';
import { PARAMETER_NAMES, PARAMETER_TITLES, UNIT_LIST } from '../../../core/config/parameters.config';
import { BASE_VALUES, GAUGE_RANGE, STATUS_LIMITS } from '../../../core/config/parameters.config';
import { ParameterName } from '../../../core/models/telemetry.model';
import { Gauge } from '../components/gauge/gauge';
import { TrendChart } from '../components/trend-chart/trend-chart';

@Component({
  selector: 'app-dashboard',
  imports: [Gauge, TrendChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  telemetry = inject(TelemetryService);
  units = inject(UnitConversionService);
  theme = inject(ThemeService);
  exporter = inject(ExportService);

  names = PARAMETER_NAMES;
  titles: any = PARAMETER_TITLES;
  unitList: any = UNIT_LIST;

  ngOnInit() {
    this.telemetry.start();
  }

  getValue(name: ParameterName): string {
    const data: any = this.telemetry.data();
    if (!data) {
      return '--';
    }
    return this.units.format(this.units.convert(name, data[name].value));
  }

  changeUnit(name: ParameterName, event: any) {
    this.units.setUnit(name, event.target.value);
  }

  getPercent(name: ParameterName): number {
    const data: any = this.telemetry.data();
    if (!data) {
      return 0;
    }
    const range = GAUGE_RANGE[name];
    const baseValue = data[name].value;
    return ((baseValue - range.min) / (range.max - range.min)) * 100;
  }

  getStatus(name: ParameterName): string {
    const data: any = this.telemetry.data();
    if (!data) {
      return 'Normal';
    }
    const original = BASE_VALUES[name];
    const difference = Math.abs(data[name].value - original);
    const differencePercent = (difference / original) * 100;

    if (differencePercent > STATUS_LIMITS.criticalPercent) {
      return 'Critical';
    }
    if (differencePercent > STATUS_LIMITS.warningPercent) {
      return 'Warning';
    }
    return 'Normal';
  }

  getColor(name: ParameterName): string {
    const status = this.getStatus(name);
    if (status === 'Critical') {
      return 'var(--critical)';
    }
    if (status === 'Warning') {
      return 'var(--warning)';
    }
    return 'var(--normal)';
  }

  getHistory(name: ParameterName): any[] {
    const data: any = this.telemetry.data();
    if (!data) {
      return [];
    }
    return data[name].history;
  }
}
