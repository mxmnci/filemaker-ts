import { fmAxios, FMAxiosConfig } from './fmAxios';

export class Http {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  get<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(url, 'GET', this.authToken, config);
  }

  post<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(url, 'POST', this.authToken, config);
  }

  put<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(url, 'PUT', this.authToken, config);
  }

  delete<T>(url: string, config?: FMAxiosConfig) {
    return fmAxios<T>(url, 'DELETE', this.authToken, config);
  }
}
