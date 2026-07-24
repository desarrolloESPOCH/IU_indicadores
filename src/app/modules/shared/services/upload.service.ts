import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface UploadResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  /**
   * Carga masiva de Indicadores Generales / Académicos (Retención, Deserción, Titulación)
   * POST /swindicadores/indicadores/
   */
  async uploadIndicadoresGenerales(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${environment.api}/`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al procesar el archivo de indicadores generales');
    }
    return data;
  }

  /**
   * Carga masiva de Indicadores de Calidad (Múltiples hojas)
   * POST /swindicadores/indicadores/calidad/
   */
  async uploadIndicadoresCalidad(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${environment.api}/calidad/`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al procesar el archivo de indicadores de calidad');
    }
    return data;
  }
}
