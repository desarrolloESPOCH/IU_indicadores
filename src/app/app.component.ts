import { Component, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [ButtonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'IU_indicadores';
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
