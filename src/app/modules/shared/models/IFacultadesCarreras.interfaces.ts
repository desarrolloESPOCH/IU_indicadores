export interface ICarrera {
  carrera: string;
  codigoCarrrera: string;
}

export interface IListFacultadesCarreras {
  facultad: string;
  carreras: ICarrera[];
}
