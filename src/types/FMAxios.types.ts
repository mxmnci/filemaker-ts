import { AxiosRequestConfig, Method } from 'axios';

export type FMAxiosConfig = AxiosRequestConfig & { contentType?: string };

export enum FMAuthMethod {
  BASIC = 'BASIC',
  BEARER = 'BEARER',
  NONE = 'NONE',
}

export type FMAuth = {
  method: FMAuthMethod;
  token?: string;
};

export type FMAxiosParams<T> = {
  baseURL: string;
  url: string;
  method: Method;
  data?: T;
  auth: FMAuth;
  config?: FMAxiosConfig;
};
