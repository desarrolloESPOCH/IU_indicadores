import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/indicadores/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'indicadores/:idCarrera',
    component: DashboardComponent,
  },
];
