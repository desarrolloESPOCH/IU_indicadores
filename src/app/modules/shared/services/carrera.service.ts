import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IResponse } from '../models/IResponse.interface';
import { ICarreraIndicador } from '../models/ICarrera.interfaces';
@Injectable({
  providedIn: 'root',
})
export class CarreraService {
  getById = async (
    idCarrera: string,
  ): Promise<IResponse<ICarreraIndicador>> => {
    if (!idCarrera) {
      throw new Error('El id de la carrera no puede ser nulo o indefinido');
    }
    const response = await fetch(`${environment.api}/carrera/${idCarrera}`);
    const data = await response.json();
    console.log('data: ', data);
    return data;
  };
}
