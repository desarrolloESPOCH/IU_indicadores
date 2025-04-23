import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-c-table-resumen-indicadores',
  imports: [TableModule],
  templateUrl: './c-table-resumen-indicadores.component.html',
  styleUrl: './c-table-resumen-indicadores.component.css',
})
export class CTableResumenIndicadoresComponent {
  graduados = input.required<any[]>();
}
