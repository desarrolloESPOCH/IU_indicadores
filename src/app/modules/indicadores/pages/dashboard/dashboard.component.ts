// cspell:disable
import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { CChartComponent } from '../../components/c-chart/c-chart.component';
import { CarreraService } from '../../../shared/services/carrera.service';
import { CardModule } from 'primeng/card';
import { CChartAniosComponent } from '../../components/c-chart-anios/c-chart-anios.component';
import { CTableResumenIndicadoresComponent } from '../../components/c-table-resumen-indicadores/c-table-resumen-indicadores.component';
import { CChartPeriodosComponent } from '../../components/c-chart-periodos/c-chart-periodos.component';
import { Select } from 'primeng/select';
import { CTableResumenGraduadosComponent } from '../../components/c-table-resumen-graduados/c-table-resumen-graduados.component';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CalidadService } from '../../../shared/services/calidad.service';
// import { JsonPipe } from '@angular/common';
import { CChartCalidadComponent } from '../../components/c-chart-calidad/c-chart-calidad.component';
import { driver } from 'driver.js';
@Component({
  selector: 'app-dashboard',
  imports: [
    Select,
    FormsModule,
    ChartModule,
    CChartComponent,
    CardModule,
    CChartAniosComponent,
    CTableResumenIndicadoresComponent,
    CChartPeriodosComponent,
    CTableResumenGraduadosComponent,
    TabsModule,
    BadgeModule,
    OverlayBadgeModule,
    AvatarModule,
    AvatarGroupModule,
    CChartCalidadComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit {
  private swCarrera = inject(CarreraService);
  private swCalidad = inject(CalidadService);
  idCarrera = input.required<string>();
  graficos = signal<any[]>([
    { name: 'Barras', code: 'bar' },
    { name: 'Lineas', code: 'line' },
    // { name: 'Pastel', code: 'pie' },
    { name: 'Radar', code: 'radar' },
  ]);

  descripcionIndicadores = signal<any[]>([
    //tasa de retencion
    'La tasa de retención representa el porcentaje de estudiantes matriculados en el primer nivel de una carrera que continúan sus estudios en la carrera durante los dos años posteriores a su ingreso. La información de la tasa de retención se presenta por período académico y para los últimos cinco años.',
    'La tasa de deserción corresponde al porcentaje de estudiantes matriculados en el primer nivel de la carrera y que no continúan sus estudios al menos dos años posteriores a su ingreso. La información de la tasa de deserción se presenta por período académico y para los últimos cinco años.',
    'La tasa de titulación representa el porcentaje de estudiantes que culminan su formación académica y obtienen el título correspondiente dentro del plazo formal de duración de la carrera más tres períodos académicos adicionales, en relación con el total de estudiantes que se matricularon en primer nivel en una cohorte específica. La información de la tasa de titulación se presenta por período académico y para los últimos cinco años. Para el período académico en curso, el valor de la tasa se calcula únicamente cuando dicho período haya finalizado y se dispone de la información completa de titulación de la cohorte evaluada.',
    //numero de graduados
    'Este indicador cuantifica el total de estudiantes que han cumplido satisfactoriamente con todos los requisitos académicos y administrativos para obtener el título correspondiente a la carrera, durante un año calendario específico. La información se presenta de forma consolidada para los últimos cinco años. Para el año fiscal en curso, la información del número de graduados se actualiza de manera progresiva conforme se ejecutan los procesos académicos y avanza el calendario institucional. El dato se consolida una vez finalizado el año respectivo.',
    //numero de matriculados
    'Este indicador registra el número total de estudiantes que han formalizado su matrícula en la carrera durante un período académico específico. La información se presenta de forma desagregada para los últimos cinco años.',
    //número de admitidos
    'Este indicador corresponde al número total de estudiantes que han sido aceptados formalmente para iniciar sus estudios en el primer nivel de la carrera, tras cumplir con los requisitos de ingreso establecidos por la institución, durante un período académico específico. La información se presenta de manera desagregada para los últimos cinco años.',
  ]);

  // selectedGrafica: Grafica = ;
  selectedGrafica = linkedSignal(() => {
    return this.graficos()[0];
  });

  chartValue = linkedSignal(() => this.selectedGrafica().code || 'bar');

  $carrera = linkedSignal(() => {
    return '';
  });

  $resumen = linkedSignal(() => {
    const A = this.$carreraResource.value()?.tabla;
    const B = this.$MatriculadosResource.value()?.data;
    const C = this.$AdmitidosResource.value()?.data;

    return A.map((itemA: any) => {
      const itemB = B?.find(
        (itemB) => itemB.codPeriodo === itemA.codigoPeriodo,
      );
      const itemC = C?.find(
        (itemC) => itemC.codPeriodo === itemA.codigoPeriodo,
      );

      return {
        ...itemA,
        valorMatriculados: itemB ? itemB.cantidad : 0,
        ValorAdmitidos: itemC ? itemC.cantidad : 0,
      };
    });
  });

  loaderEffect = effect(() => {
    this.$carrera.set(this.idCarrera().toUpperCase());
  });

  $carreraResource = resource({
    request: () => this.$carrera(),
    loader: async ({ request }) => {
      const value = await this.swCarrera.getById(request);
      // console.log('value', value);
      return value.data[0];
    },
  });
  onChangeGrafica(event: any) {
    this.chartValue.set(event.code);
  }

  $TituladosResource = resource({
    request: () => this.$carrera(),
    loader: ({ request }) => this.swCarrera.getGraduadosPorAnios(request),
  });
  $MatriculadosResource = resource({
    request: () => this.$carrera(),
    loader: ({ request }) => this.swCarrera.getMatriculadosPorPeriodo(request),
  });
  $AdmitidosResource = resource({
    request: () => this.$carrera(),
    loader: ({ request }) => this.swCarrera.getAdmitidosPorPeriodos(request),
  });

  $CalidadData = resource({
    request: () => this.$carrera(),
    loader: ({ request }) => this.swCalidad.getAll(request),
  });

  ngAfterViewInit(): void {
    const driverObj = driver({
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Listo',
      showProgress: true,
      steps: [
        {
          element: '#title',
          popover: {
            title: 'Bienvenido',
            description: ' A continuación se mostrará un tour por el dashboard',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '.IndicadorAca',
          popover: {
            title: 'Indicadores Académicos',
            description: 'Actualmente se tienen 6 Indicadores Académicos',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '.IndicadorCal',
          popover: {
            title: 'Indicadores de Calidad',
            description: 'Información de 33 Indicadores de Calidad',
            side: 'left',
            align: 'start',
          },
        },
        {
          element: '.tipo',
          popover: {
            title: 'Tipo de Gráfica',
            description:
              'Puede seleccionar el tipo de gráfica que desea visualizar',
            side: 'left',
            align: 'start',
          },
        },
      ],
    });
    if (!localStorage.getItem('tour')) {
      localStorage.setItem('tour', 'true');
      driverObj.drive();
    }
  }
}
