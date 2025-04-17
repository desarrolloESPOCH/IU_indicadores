import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IResponse } from '../models/IResponse.interface';
import { IListFacultadesCarreras } from '../models/IFacultadesCarreras.interfaces';
@Injectable({
  providedIn: 'root',
})
export class FacultadService {
  constructor() {}

  getAll = async (): Promise<IResponse<IListFacultadesCarreras[]>> => {
    const response = await fetch(`${environment.api}/facultad`);
    const data = await response.json();
    return data;
  };
}
