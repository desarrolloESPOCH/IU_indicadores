import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IResponse } from '../models/IResponse.interface';
@Injectable({
  providedIn: 'root',
})
export class CalidadService {
  getAll = async (
    idCarrera: string,
  ): Promise<IResponse<IndicadoresCalidad>> => {
    const response = await fetch(`${environment.api}/calidad/${idCarrera}`);
    const data = await response.json();
    return data;
  };
}

export interface Periodo {
  idValor: number;
  valor: number;
  nombrePeriodo: string;
}

export interface IndicadoresCalidad {
  titulo: string;
  idIndicador: number;
  periodos: Periodo[];
  descripcion: string;
}
