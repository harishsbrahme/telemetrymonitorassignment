import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelemetryService } from './core/services/telemetry.service';
import { UnitConversionService } from './core/services/unit-conversion.service';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

@Component({
  imports: [RouterOutlet, Dashboard],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  telemetry = inject(TelemetryService);

  units = inject(UnitConversionService);

  ngOnInit() {
    this.telemetry.start();
  }
}
