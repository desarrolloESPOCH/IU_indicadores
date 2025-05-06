// cspell:disable
import {
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private swCarrera = inject(CarreraService);
  idCarrera = input.required<string>();
  graficos = signal<any[]>([
    { name: 'Barras', code: 'bar' },
    { name: 'Lineas', code: 'line' },
    { name: 'Pastel', code: 'pie' },
    { name: 'Radar', code: 'radar' },
  ]);

  // selectedGrafica: Grafica = ;
  selectedGrafica = linkedSignal(() => {
    return this.graficos()[0];
  });

  chartValue = linkedSignal(() => this.selectedGrafica().code || 'bar');

  $carrera = linkedSignal(() => {
    return '';
  });

  loaderEffect = effect(() => {
    this.$carrera.set(this.idCarrera().toUpperCase());
  });

  $carreraResource = resource({
    request: () => this.$carrera(),
    loader: async ({ request }) => {
      const value = await this.swCarrera.getById(request);
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
}
