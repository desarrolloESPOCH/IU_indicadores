export interface IPeriodos {
  codigoPeriodo: string;
  nombrePeriodo: string;
  valor: number;
}

export interface Indicadores {
  titulo: string;
  periodos: IPeriodos[];
}
export interface ICarreraIndicador {
  codigoFacultad: string;
  codigoCarrera: string;
  nombreCarrera: string;
  indicadores: Indicadores[];
  tabla: any;
}
export interface INumeroGraduados {
  Anio: number;
  codPeriodo?: string;
  NumeroGraduados: number;
  cantidad?: number;
}

export interface INumeroPeriodos {
  codPeriodo: string;
  descripcion: string;
  cantidad: number;
}
