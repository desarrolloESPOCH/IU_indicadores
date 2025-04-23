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
