export interface ICarrera {
  carrera: string;
  codigoCarrera: string;
}

export interface IFacultadCarrera {
  facultad: string;
  items: ICarrera[];
}
