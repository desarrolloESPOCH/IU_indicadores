import {
  ChangeDetectorRef,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { INumeroGraduados } from '../../../shared/models/ICarrera.interfaces';
import { PopoverModule } from 'primeng/popover';
import { AccordionModule } from 'primeng/accordion';
@Component({
  selector: 'app-c-chart-anios',
  imports: [ChartModule, PopoverModule, AccordionModule],
  templateUrl: './c-chart-anios.component.html',
  styleUrl: './c-chart-anios.component.css',
})
export class CChartAniosComponent implements OnInit {
  $indicador = input.required<INumeroGraduados[]>();
  $anios = signal<number[]>([0]);
  $valores = signal<number[]>([0]);
  $nombrePeriodo = signal<number>(0);

  ngOnInit() {
    if (this.$indicador()) {
      this.$anios.set(this.$indicador().map((e) => e.Anio));

      this.$valores.set(this.$indicador().map((e) => e.NumeroGraduados));
      console.log('this.$anios(): ', this.$anios());
      console.log('this.$valores(): ', this.$valores());

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
          data: [
            ...this.$valores(),
            // 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ],
          backgroundColor: [
            'rgba(249, 115, 22, 0.4)',
            'rgba(6, 182, 212, 0.4)',
            'rgb(107, 114, 128, 0.4)',
            'rgba(139, 92, 246, 0.4)',
            'rgba(34, 197, 94, 0.4)' /* Verde */,
            'rgba(244, 63, 94, 0.4)' /* Rojo */,
          ],
          borderColor: [
            'rgb(249, 115, 22)',
            'rgb(6, 182, 212)',
            'rgb(107, 114, 128)',
            'rgb(139, 92, 246)',
            'rgba(34, 197, 94 )' /* Verde */,
            'rgba(244, 63, 94)' /* Rojo */,
          ],
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
}
