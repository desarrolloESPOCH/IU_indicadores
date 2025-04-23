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
import { TableModule } from 'primeng/table';
// import { CFilterCarrerasComponent } from '../../components/c-filter-carreras/c-filter-carreras.component';
import { CChartComponent } from '../../components/c-chart/c-chart.component';
import { CarreraService } from '../../../shared/services/carrera.service';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-dashboard',
  imports: [
    SelectModule,
    FormsModule,
    ChartModule,
    TableModule,
    // CFilterCarrerasComponent,
    CChartComponent,
    CardModule,
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
    this.getIndicadores(this.$carrera());
    console.log('ID Carrera:', this.$carrera());
  });

  $selectCarrera = linkedSignal(() => {
    return '';
  });

  $carreraResource = resource({
    request: () => this.$selectCarrera(),
    loader: ({ request }) => this.swCarrera.getById(request),
  });

  getIndicadores = (event: string) => {
    this.$selectCarrera.set(event);
  };
}
