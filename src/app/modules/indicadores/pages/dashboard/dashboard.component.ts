import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CFilterCarrerasComponent } from '../../components/c-filter-carreras/c-filter-carreras.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    SelectModule,
    FormsModule,
    ChartModule,
    TableModule,
    CFilterCarrerasComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  products!: any[];

  basicData: any;

  basicOptions: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
    this.products = [
      {
        id: 'P0031',
        code: 'P0031',
        admitidos: '19540',
        matriculados: '20325',
        graduados: '15702',
        retension: 19620,
        desercion: '18000',
        titulacion: 18000,
      },
      {
        id: 'P0031',
        code: 'P0032',
        admitidos: '19540',
        matriculados: '20325',
        graduados: '15702',
        retension: 19620,
        desercion: '18000',
        titulacion: 18000,
      },
      {
        id: 'P0031',
        code: 'P0033',
        admitidos: '19540',
        matriculados: '20325',
        graduados: '15702',
        retension: 19620,
        desercion: '18000',
        titulacion: 18000,
      },
      {
        id: 'P0031',
        code: 'P0034',
        admitidos: '19540',
        matriculados: '20325',
        graduados: '15702',
        retension: 19620,
        desercion: '18000',
        titulacion: 18000,
      },
      {
        id: 'P0031',
        code: 'P0035',
        admitidos: '19540',
        matriculados: '20325',
        graduados: '15702',
        retension: 19620,
        desercion: '18000',
        titulacion: 18000,
      },
    ];
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color',
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color',
      );

      this.basicData = {
        labels: [
          'P0031',
          'P0032',
          'P0033',
          'P0034',
          'P0035',
          'P0036',
          'P0037',
          'P0038',
          'P0039',
          'P0040',
        ],
        datasets: [
          {
            label: 'Estudiantes',
            data: [
              19540, 20325, 15702, 19620, 18245, 18467, 17732, 17300, 18000,
              16000,
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
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
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
      this.cd.markForCheck();
    }
  }

  getIndicadores = (event: string) => {
    console.log('event padre: ', event);
  };
}
