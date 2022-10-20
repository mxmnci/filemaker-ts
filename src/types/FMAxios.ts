import { AxiosRequestConfig, Method } from 'axios';

export type FMAxiosConfig = AxiosRequestConfig & { contentType?: string };

export enum FMAuthMethod {
  BASIC = 'BASIC',
  BEARER = 'BEARER',
}

export type FMAuth = {
  method: FMAuthMethod;
  token: string;
};

export type FMAxiosParams = {
  baseURL: string;
  url: string;
  method: Method;
  auth: FMAuth;
  config?: FMAxiosConfig;
};
