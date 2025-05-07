import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-c-table-resumen-graduados',
  imports: [TableModule, CommonModule],

  templateUrl: './c-table-resumen-graduados.component.html',
  styleUrl: './c-table-resumen-graduados.component.css',
})
export class CTableResumenGraduadosComponent {
  graduados = input.required<any[]>();
}
