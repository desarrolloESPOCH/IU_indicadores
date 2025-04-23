// cspell:disable
import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';
import { CChartComponent } from '../../components/c-chart/c-chart.component';
import { CarreraService } from '../../../shared/services/carrera.service';
import { CardModule } from 'primeng/card';
import { CChartAniosComponent } from '../../components/c-chart-anios/c-chart-anios.component';
import { CTableResumenIndicadoresComponent } from '../../components/c-table-resumen-indicadores/c-table-resumen-indicadores.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    SelectModule,
    FormsModule,
    ChartModule,
    CChartComponent,
    CardModule,
    CChartAniosComponent,
    CTableResumenIndicadoresComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private swCarrera = inject(CarreraService);

  idCarrera = input.required<string>();
  $carrera = linkedSignal(() => {
    return '';
  });

  loaderEffect = effect(() => {
    this.$carrera.set(this.idCarrera().toUpperCase());
    console.log(
      '  this.$carrera: ',
      this.$carrera,
      this.$TituladosResource.value(),
    );
  });

  $carreraResource = resource({
    request: () => this.$carrera(),
    loader: async ({ request }) => {
      const value = await this.swCarrera.getById(request);
      return value.data[0];
    },
  });

  $TituladosResource = resource({
    request: () => this.$carrera(),
    loader: ({ request }) => this.swCarrera.getGraduadosPorAnios(request),
  });
}
