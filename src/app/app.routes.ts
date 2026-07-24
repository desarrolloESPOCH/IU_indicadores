import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/indicadores/pages/dashboard/dashboard.component';
import { CargarIndicadoresComponent } from './modules/indicadores/pages/cargar-indicadores/cargar-indicadores.component';

export const routes: Routes = [
  {
    path: 'cargar',
    component: CargarIndicadoresComponent,
  },
  {
    path: ':idCarrera',
    component: DashboardComponent,
  },
];
