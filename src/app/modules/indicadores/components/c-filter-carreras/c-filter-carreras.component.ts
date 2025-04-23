// cspell:disable
import {
  Component,
  inject,
  resource,
  output,
  linkedSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FacultadService } from '../../../shared/services/facultad.service';
import { ICarrera } from '../../../shared/models/IFacultadesCarreras.interfaces';
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

  // recurso para cargar datos de facultades
  $facultadResource = resource({
    loader: () => this.swFacultad.getAll(),
  });

  //carrera seleccionada
  $selectedCarrera = linkedSignal(() => {
    return {};
  });

  //cambio de carrera seleccionada
  changeCarrera = (carrera: ICarrera) => {
    console.log('carrera: ', carrera);
    this.codCarrera.emit(carrera.codigoCarrera);
    this.$selectedCarrera.set(carrera);
  };
}
