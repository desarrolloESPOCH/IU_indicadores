import {
  ChangeDetectorRef,
  Component,
  effect,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { INumeroPeriodos } from '../../../shared/models/ICarrera.interfaces';
import { Popover, PopoverModule } from 'primeng/popover';
import { AccordionModule } from 'primeng/accordion';
import { ChartType } from '../c-chart/c-chart.component';
@Component({
  selector: 'app-c-chart-periodos',
  imports: [ChartModule, PopoverModule, AccordionModule],
  templateUrl: './c-chart-periodos.component.html',
  styleUrl: './c-chart-periodos.component.css',
})
export class CChartPeriodosComponent implements OnInit {
  $indicador = input.required<INumeroPeriodos[]>();
  $titulo = input.required<string>();
  $descripcionIndicador = input<string>('');

  $periodos = signal<string[]>(['']);
  $anios = signal<string[]>(['']);
  $valores = signal<number[]>([0]);
  $nombrePeriodo = signal<number>(0);
  $chart = input<string>(ChartType.Bar);

  effectloader = effect(() => {
    this.$chart();
    this.initChart();
  });

  ngOnInit() {
    if (this.$indicador()) {
      this.$anios.set(this.$indicador()!.map((e) => e.codPeriodo) || 0);

      this.$valores.set(this.$indicador().map((e) => e.cantidad));

      this.initChart();
    }
  }

  basicData: any;

  basicOptions: any;

  constructor(private cd: ChangeDetectorRef) {}

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    // const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color',
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color',
    );

    this.basicData = {
      labels: this.$anios(),
      datasets: [
        {
          type: this.$chart(),
          data: [
            ...this.$valores(),
            // 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ],
          backgroundColor: [
            'rgba(255, 255, 255, 0.1)',

            // 'rgba(249, 115, 22, 0.4)',
            // 'rgba(6, 182, 212, 0.4)',
            // 'rgb(107, 114, 128, 0.4)',
            // 'rgba(139, 92, 246, 0.4)',
            // 'rgba(34, 197, 94, 0.4)' /* Verde */,
            // 'rgba(244, 63, 94, 0.4)' /* Rojo */,
          ],
          borderColor: [
            'rgb(249, 115, 22)',
            'rgb(6, 182, 212)',
            'rgb(107, 114, 128)',
            'rgb(139, 92, 246)',
            'rgba(244, 63, 94)' /* Rojo */,
            'rgba(34, 197, 94)' /* Verde */,
            'rgba(236, 72, 153)' /* Rosa */,
            'rgba(20, 184, 166)' /* Turquesa */,
            'rgba(168, 85, 247)' /* Púrpura */,
            'rgba(234, 179, 8)', // Amarillo mostaza
          ],
          // fill: true,
          borderWidth: 1,
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        colors: {
          // forceOverride: true,
        },
        legend: {
          display: false,
          labels: {
            // color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
    // this.cd.markForCheck();
  }

  @ViewChild('op') popover!: Popover;

  select(value: any) {
    this.$nombrePeriodo.set(value!.element.index);
    this.popover.hide();
    this.popover.show(event);
  }
}
