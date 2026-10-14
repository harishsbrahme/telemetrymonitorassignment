import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardResponse } from '../models/telemetry.model';
import { API_URL, POLL_INTERVAL_MS } from '../config/api.config';
import { ExportService } from './export.service';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  http = inject(HttpClient);
  exporter = inject(ExportService);

  data = signal<DashboardResponse | null>(null);

  loading = signal(true);

  errorMessage = signal('');

  connected = signal(false);

  lastUpdated = signal<Date | null>(null);

  timerId: any = null;
  isFetching = false;

  start() {
    if (this.timerId !== null) {
      return;
    }
    this.fetchData();
    this.timerId = setInterval(() => this.fetchData(), POLL_INTERVAL_MS);
  }

  stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  fetchData() {
    if (this.isFetching) {
      return;
    }
    this.isFetching = true;

    this.http.get<DashboardResponse>(API_URL + '/dashboard').subscribe({
      next: (response) => {
        this.data.set(response);
        this.exporter.addData(response);
        this.lastUpdated.set(new Date());
        this.connected.set(true);
        this.errorMessage.set('');
        this.loading.set(false);
        this.isFetching = false;
      },
      error: () => {
        this.connected.set(false);
        this.errorMessage.set('Cannot connect to the backend. Retrying...');
        this.loading.set(false);
        this.isFetching = false;
      },
    });
  }
}
