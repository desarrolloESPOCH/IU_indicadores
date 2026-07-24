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

  getTodosLosIndicadores = async (): Promise<IResponse<any>> => {
    const response = await fetch(`${environment.api}/calidad-todos`);
    return await response.json();
  };

  updateEstado = async (idIndicador: number, codigoCarrera: string, estado: number): Promise<IResponse<any>> => {
    const response = await fetch(`${environment.api}/calidad/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idIndicador, codigoCarrera, estado }),
    });
    return await response.json();
  };

  updateValor = async (idValor: number, valor: number | null): Promise<IResponse<any>> => {
    const response = await fetch(`${environment.api}/calidad/valor`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idValor, valor }),
    });
    return await response.json();
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
