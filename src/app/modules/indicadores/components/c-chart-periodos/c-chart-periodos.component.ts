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
import { calcularLineaTendencia } from '../../../shared/utils/lineaTendencia';
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
  lineaTendencia: number[] = [];
  m = 0;
  b = 0;
  mostrarLeyenda = signal(false);

  effectloader = effect(() => {
    this.$chart();
    this.initChart();
  });

  ngOnInit() {
    if (this.$indicador()) {
      this.$anios.set(this.$indicador()!.map((e) => e.codPeriodo) || 0);

      this.$valores.set(this.$indicador().map((e) => e.cantidad));
      const { lineaTendencia, m, b } = calcularLineaTendencia(this.$valores());
      this.lineaTendencia = lineaTendencia;
      this.m = m;
      this.b = b;
      this.initChart();
    }
  }

  basicData: any;

  basicOptions: any;

  constructor(private cd: ChangeDetectorRef) {}

  initChart() {
    this.basicData = {
      labels: this.$anios(),
      datasets: [
        {
          label: '',
          type: this.$chart(),
          data: [
            ...this.$valores(),
            // 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ],
          backgroundColor: [
            // 'rgba(255, 255, 255, 0.1)',

            'rgba(249, 115, 22, 0.5)',
            // 'rgba(6, 182, 212, 0.4)',
            // 'rgb(107, 114, 128, 0.4)',
            // 'rgba(139, 92, 246, 0.4)',
            // 'rgba(34, 197, 94, 0.4)' /* Verde */,
            // 'rgba(244, 63, 94, 0.4)' /* Rojo */,
          ],
          borderColor: [
            'rgb(249, 115, 22)',
            // 'rgb(6, 182, 212)',
            // 'rgb(107, 114, 128)',
            // 'rgb(139, 92, 246)',
            // 'rgba(244, 63, 94)' /* Rojo */,
            // 'rgba(34, 197, 94)' /* Verde */,
            // 'rgba(236, 72, 153)' /* Rosa */,
            // 'rgba(20, 184, 166)' /* Turquesa */,
            // 'rgba(168, 85, 247)' /* Púrpura */,
            // 'rgba(234, 179, 8)', // Amarillo mostaza
          ],
          // fill: true,
          borderWidth: 1,
        },
        ...(this.$chart() === 'line'
          ? [
              {
                label: !this.mostrarLeyenda()
                  ? `Línea de Tendencia (fórmula: y = (${this.m.toFixed(2)}) · x + (${this.b.toFixed(2)}))`
                  : 'Ver Línea de Tendencia',
                data: this.lineaTendencia,
                type: 'line',
                borderColor: '#FF6384',
                borderDash: [5, 5], // Línea discontinua para diferenciar
                fill: false,
                pointRadius: 0, // Sin puntos en la línea de tendencia
                tension: 0.4, // Suaviza la línea, opcional
                hidden: this.mostrarLeyenda(),
              },
            ]
          : []),
      ],
    };

    this.basicOptions = {
      plugins: {
        colors: {},
        legend: {
          display: this.$chart() == 'line' ? true : false,
          labels: {
            // Filtramos para que solo muestre leyendas de datasets que tengan label definido y no vacío
            filter: function (item: any) {
              // Si el label es undefined, null o cadena vacía, no mostrar
              return !!item.text && item.text.trim() !== '';
            },
          },
          onClick: (e: any, legendItem: any) => {
            if (
              legendItem.text.startsWith('Línea de Tendencia') ||
              legendItem.text.startsWith('Ver Línea de Tendencia')
            ) {
              this.mostrarLeyenda.set(!this.mostrarLeyenda());

              this.initChart();
            }
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              '--p-text-muted-color',
            ),
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              '--p-content-border-color',
            ),
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              '--p-text-muted-color',
            ),
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              '--p-content-border-color',
            ),
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
