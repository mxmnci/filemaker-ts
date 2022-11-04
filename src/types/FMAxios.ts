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

export enum FMErrorCode {
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  METHOD_NOT_ALLOWED = '405',
  UNSUPPORTED_MEDIA_TYPE = '415',
  FILEMAKER_ERROR = '500',
}
