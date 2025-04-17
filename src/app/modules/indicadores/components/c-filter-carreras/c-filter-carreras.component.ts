// cspell:disable
import {
  Component,
  inject,
  resource,
  effect,
  signal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FacultadService } from '../../../shared/services/facultad.service';
@Component({
  selector: 'app-c-filter-carreras',
  imports: [FormsModule, SelectModule],
  templateUrl: './c-filter-carreras.component.html',
  styleUrl: './c-filter-carreras.component.css',
})
export class CFilterCarrerasComponent {
  //servicios
  swFacultad = inject(FacultadService);

  //evento de salida
  codCarrera = output<string>();
  //carrera seleccionada
  selectedCarrera = signal<any>({});

  // recurso para cargar datos de facultades
  facultadResource = resource({
    loader: () => this.swFacultad.getAll(),
  });
  // lista de carreras agrupadas por facultad
  groupCarreras = signal<any[]>([]);

  constructor() {
    effect(() => {
      const facultades = this.facultadResource.value()?.data;
      console.log('facultades: ', facultades);
      if (facultades) {
        const resultado = this.agruparFacultades(facultades);
        this.groupCarreras.set(resultado);
        // this.selectedCarrera.set(resultado[0].items[0]);
      }
    });
  }

  agruparFacultades = (facultades: any) => {
    const grouped = facultades.reduce(
      (acc: { [key: string]: any[] }, item: any) => {
        const key = item.codigoFacultad;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {},
    );
    // Convertir el objeto agrupado en formatp de objetos para el select
    const resultado = Object.keys(grouped).map((codigoFacultad: string) => ({
      facultad: codigoFacultad,
      items: grouped[codigoFacultad].map((indicador: any) => ({
        carrera: indicador.strNombre,
        codigoCarrera: indicador.codigoCarrera,
      })),
    }));
    return resultado;
  };

  //cambio de carrera seleccionada
  selectedCarreraChanged = (event: any) => {
    console.log('carrera: ', event.value);
    // this.selectedCarrera.set(carrera);
    this.codCarrera.emit(this.selectedCarrera().codigoCarrera);
  };
}
