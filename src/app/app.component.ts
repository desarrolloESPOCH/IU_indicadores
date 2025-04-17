import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DashboardComponent } from './modules/indicadores/pages/dashboard/dashboard.component';
import { PrimeNG } from 'primeng/config';
@Component({
  selector: 'app-root',
  imports: [ButtonModule, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'IU_indicadores';
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
