import {
  ChangeDetectorRef,
  Component,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Indicadores } from '../../../shared/models/ICarrera.interfaces';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { AccordionModule } from 'primeng/accordion';
@Component({
  selector: 'app-c-chart',
  imports: [ChartModule, PopoverModule, AccordionModule],
  templateUrl: './c-chart.component.html',
  styleUrl: './c-chart.component.css',
})
export class CChartComponent implements OnInit {
  $indicador = input.required<Indicadores>();
  $periodos = signal<string[]>(['']);
  $valores = signal<number[]>([0]);
  $nombrePeriodo = signal<number>(0);

  // op = viewChild<ElementRef<HTMLButtonElement>>('op');

  @ViewChild('op') popover!: Popover;

  ngOnInit() {
    if (this.$indicador()) {
      this.$periodos.set(
        this.$indicador()!.periodos!.map((e) => e.codigoPeriodo),
      );

      this.$valores.set(this.$indicador()!.periodos!.map((e) => e.valor));

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
      labels: this.$periodos(),
      datasets: [
        {
          data: [
            ...this.$valores(),
            // 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
          ],
          backgroundColor: [
            'rgba(249, 115, 22, 0.2)',
            'rgba(6, 182, 212, 0.2)',
            'rgb(107, 114, 128, 0.2)',
            'rgba(139, 92, 246, 0.2)',
          ],
          borderColor: [
            'rgb(249, 115, 22)',
            'rgb(6, 182, 212)',
            'rgb(107, 114, 128)',
            'rgb(139, 92, 246)',
          ],
          borderWidth: 0,
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

  select(value: any) {
    console.log('value', value!.element.index);
    this.$nombrePeriodo.set(value!.element.index);
    this.popover.hide();
    this.popover.show(event);
    // this.popover.onEscapeKeydown(event);
  }
}
