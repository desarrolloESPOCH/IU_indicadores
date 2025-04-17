export interface IResponse<T> {
  count: number;
  message: string;
  data: T[];
}
