import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IResponse } from '../models/IResponse.interface';
import { IFacultadCarrera } from '../models/IFacultadesCarreras.interfaces';
@Injectable({
  providedIn: 'root',
})
export class FacultadService {
  getAll = async (): Promise<IResponse<IFacultadCarrera>> => {
    const response = await fetch(`${environment.api}/facultad`);
    const data = await response.json();
    return data;
  };
}
