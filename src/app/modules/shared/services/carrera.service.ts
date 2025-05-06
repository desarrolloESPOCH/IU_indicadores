import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IResponse } from '../models/IResponse.interface';
import {
  ICarreraIndicador,
  INumeroGraduados,
  INumeroPeriodos,
} from '../models/ICarrera.interfaces';
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
    return data;
  };

  getGraduadosPorAnios = async (
    idCarrera: string,
  ): Promise<IResponse<INumeroGraduados>> => {
    const response = await fetch(
      `${environment.api}/carrera/graduados/${idCarrera}`,
    );
    const data = await response.json();
    return data;
  };
  getAdmitidosPorPeriodos = async (
    idCarrera: string,
  ): Promise<IResponse<INumeroPeriodos>> => {
    const response = await fetch(
      `${environment.api}/carrera/admitidos/${idCarrera}`,
    );
    const data = await response.json();
    return data;
  };
  getMatriculadosPorPeriodo = async (
    idCarrera: string,
  ): Promise<IResponse<INumeroPeriodos>> => {
    const response = await fetch(
      `${environment.api}/carrera/matriculados/${idCarrera}`,
    );
    const data = await response.json();
    return data;
  };
}
