import { Injectable, inject, signal } from '@angular/core';
import { saveAs } from 'file-saver';
import { DashboardResponse } from '../models/telemetry.model';
import { UnitConversionService } from './unit-conversion.service';

const MAX_ROWS = 3600;

@Injectable({ providedIn: 'root' })
export class ExportService {
  units = inject(UnitConversionService);

  rows: any[] = [];

  rowCount = signal(0);

  lastTime = '';

  addData(response: DashboardResponse) {
    const velocityList = response.velocity.history;
    const pressureList = response.pressure.history;
    const temperatureList = response.temperature.history;

    let start = 0;
    for (let i = 0; i < velocityList.length; i++) {
      if (velocityList[i].time === this.lastTime) {
        start = i + 1;
      }
    }

    const today = new Date().toLocaleDateString('en-CA');

    for (let i = start; i < velocityList.length; i++) {
      this.rows.push({
        date: today,
        time: velocityList[i].time,
        velocity: velocityList[i].value,
        pressure: pressureList[i] ? pressureList[i].value : 0,
        temperature: temperatureList[i] ? temperatureList[i].value : 0,
      });
      this.lastTime = velocityList[i].time;
    }

    while (this.rows.length > MAX_ROWS) {
      this.rows.shift();
    }

    this.rowCount.set(this.rows.length);
  }

  buildTable(): any[] {
    const selected = this.units.selectedUnits();

    const table: any[] = [
      [
        'Date',
        'Time',
        'Velocity (' + selected.velocity + ')',
        'Pressure (' + selected.pressure + ')',
        'Temperature (' + selected.temperature + ')',
      ],
    ];

    this.rows.forEach((row) => {
      table.push([
        row.date,
        row.time,
        Number(this.units.convert('velocity', row.velocity).toFixed(2)),
        Number(this.units.convert('pressure', row.pressure).toFixed(2)),
        Number(this.units.convert('temperature', row.temperature).toFixed(2)),
      ]);
    });

    return table;
  }

  exportCsv() {
    const table = this.buildTable();
    const text = table.map((row) => row.join(',')).join('\n');
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'telemetry-data.csv');
  }

  async exportExcel() {
    const XLSX = await import('xlsx');
    const table = this.buildTable();
    const sheet = XLSX.utils.aoa_to_sheet(table);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Telemetry');
    XLSX.writeFile(book, 'telemetry-data.xlsx');
  }
}
