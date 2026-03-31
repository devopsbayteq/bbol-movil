export interface ApiResponseModel<T> {
  code: number;
  responseType: string;
  message: string;
  data?: T;
}
