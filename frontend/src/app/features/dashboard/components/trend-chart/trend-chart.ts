import { Component, Input, OnChanges, ViewChild, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { HistoryPoint, ParameterName } from '../../../../core/models/telemetry.model';
import { UnitConversionService } from '../../../../core/services/unit-conversion.service';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-trend-chart',
  imports: [BaseChartDirective],
  templateUrl: './trend-chart.html',
  styleUrl: './trend-chart.scss',
})
export class TrendChart implements OnChanges {
  units = inject(UnitConversionService);

  @Input() name: ParameterName = 'velocity';
  @Input() unit = '';
  @Input() history: HistoryPoint[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: '#3b6ef5',
        backgroundColor: 'rgba(59, 110, 245, 0.15)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any) => 'Time: ' + items[0].label,
          label: (item: any) => 'Value: ' + item.parsed.y.toFixed(2) + ' ' + this.unit,
        },
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 6, color: '#6b7385' },
        grid: { color: 'rgba(128, 128, 128, 0.15)' },
      },
      y: {
        title: { display: true, text: '', color: '#6b7385' },
        ticks: { color: '#6b7385' },
        grid: { color: 'rgba(128, 128, 128, 0.15)' },
      },
    },
  };

  ngOnChanges() {
    const times = this.history.map((point) => point.time);

    const values = this.history.map((point) =>
      this.units.convertToUnit(this.name, point.value, this.unit)
    );

    this.chartData.labels = times;
    this.chartData.datasets[0].data = values;

    this.chartOptions.scales.y.title.text = this.name + ' (' + this.unit + ')';

    const style = getComputedStyle(document.documentElement);
    const lineColor = style.getPropertyValue('--accent').trim() || '#3b6ef5';
    const textColor = style.getPropertyValue('--muted').trim() || '#6b7385';
    this.chartData.datasets[0].borderColor = lineColor;
    this.chartOptions.scales.x.ticks.color = textColor;
    this.chartOptions.scales.y.ticks.color = textColor;
    this.chartOptions.scales.y.title.color = textColor;

    if (this.chart) {
      this.chart.update('none');
    }
  }

  zoomIn() {
    this.chart?.chart?.zoom(1.2);
  }

  zoomOut() {
    this.chart?.chart?.zoom(0.8);
  }

  resetZoom() {
    this.chart?.chart?.resetZoom();
  }
}
