import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  imports: [],
  templateUrl: './gauge.html',
  styleUrl: './gauge.scss',
})
export class Gauge {
  @Input() percent = 0;

  @Input() valueText = '--';
  @Input() unitText = '';

  @Input() color = 'var(--accent)';

  arcLength = 235.62;

  fillLength(): number {
    const safePercent = Math.min(Math.max(this.percent, 0), 100);
    return (safePercent / 100) * this.arcLength;
  }
}
