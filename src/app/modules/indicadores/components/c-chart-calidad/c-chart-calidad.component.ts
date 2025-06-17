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
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { AccordionModule } from 'primeng/accordion';
import { IndicadoresCalidad } from '../../../shared/services/calidad.service';
import { TagModule } from 'primeng/tag';
import { getTagSeverity } from '../../../shared/utils/umbrales';
import { calcularLineaTendencia } from '../../../shared/utils/lineaTendencia';

@Component({
  selector: 'app-c-chart-calidad',
  imports: [ChartModule, PopoverModule, AccordionModule, TagModule],
  templateUrl: './c-chart-calidad.component.html',
  styleUrl: './c-chart-calidad.component.css',
})
export class CChartCalidadComponent implements OnInit {
  $indicador = input.required<IndicadoresCalidad>();
  $chart = input<string>(ChartType.Bar);
  $type = input<number>(1);
  $descripcionIndicador = input<string>('');

  $periodos = signal<string[]>(['']);
  $valores = signal<number[]>([0]);
  $nombrePeriodo = signal<number>(0);
  getTagSeverity = getTagSeverity;
  lineaTendencia: number[] = [];
  m = 0;
  b = 0;
  mostrarLeyenda = false;

  // op = viewChild<ElementRef<HTMLButtonElement>>('op');
  effectloader = effect(() => {
    this.$chart();
    this.$type();
    if (this.$indicador()) {
      this.$periodos.set(
        this.$indicador()!.periodos!.map((e) => e.nombrePeriodo),
      );

      this.$valores.set(this.$indicador()!.periodos!.map((e) => e.valor));

      this.initChart();
    }
  });

  @ViewChild('op') popover!: Popover;

  ngOnInit() {
    if (this.$indicador()) {
      this.$periodos.set(
        this.$indicador()!.periodos!.map((e) => e.nombrePeriodo),
      );

      this.$valores.set(this.$indicador()!.periodos!.map((e) => e.valor));

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
      labels: this.$periodos(),
      datasets: [
        {
          label: '',
          type: this.$chart(),

          data: [
            ...this.$valores(),
            // 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ],
          backgroundColor: [
            // 'rgba(255, 255, 255, 0.5)',
            'rgba(249, 115, 22, 0.5)',

            // 'rgba(6, 182, 212, 0.4)',
            // 'rgb(107, 114, 128, 0.4)',
            // 'rgba(139, 92, 246, 0.4)',
            // 'rgba(244, 63, 94, 0.4)' /* Rojo */,
            // 'rgba(34, 197, 94, 0.4)' /* Verde */,
            // 'rgba(236, 72, 153, 0.4)' /* Rosa */,
            // 'rgba(20, 184, 166, 0.4)' /* Turquesa */,
            // 'rgba(168, 85, 247, 0.4)' /* Púrpura */,
            // 'rgba(234, 179, 8,0.4)', // Amarillo mostaza
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
          borderWidth: 1,
        },
        ...(this.$chart() === 'line'
          ? [
              {
                label: !this.mostrarLeyenda
                  ? `Línea de Tendencia (fórmula: y = (${this.m.toFixed(2)}) · x + (${this.b.toFixed(2)}))`
                  : 'Ver Línea de Tendencia',
                data: this.lineaTendencia,
                type: 'line',
                //borderColor: '#22c55e', // Verde
                borderColor: '#FF6384', // Verde

                borderDash: [5, 5], // Línea discontinua para diferenciar
                fill: false,
                pointRadius: 0, // Sin puntos en la línea de tendencia
                tension: 0.4, // Suaviza la línea, opcional
                hidden: this.mostrarLeyenda,
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
              this.mostrarLeyenda = !this.mostrarLeyenda;

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
    this.cd.markForCheck();
  }

  select(value: any) {
    this.$nombrePeriodo.set(value!.element.index);
    this.popover.hide();
    this.popover.show(event);
  }
}

export enum ChartType {
  Bar = 'bar',
  Line = 'line',
  PolarArea = 'polarArea',
  Radar = 'radar',
  Doughnut = 'doughnut',
  Pie = 'pie',
  Bubble = 'bubble',
  Scatter = 'scatter',
}
