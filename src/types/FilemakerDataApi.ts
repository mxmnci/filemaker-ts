import { FMAxiosConfig } from './FMAxios';

export * from './request';
export * from './response';

export type LoggingConfig = {
  logDebugToConsole?: boolean;
  logCombinedToFile?: boolean;
  logErrorsToFile?: boolean;
};

export type FilemakerDataAPIOptions = {
  host: string;
  database: string;
  username: string;
  password: string;
  loggingConfig?: LoggingConfig;
  requestMiddleware?: RequestMiddleware;
  responseMiddleware?: ResponseMiddleware;
};

export type HttpConfig = {
  axios?: FMAxiosConfig;
  withoutLayout?: boolean;
  noAuth?: boolean;
};

export type RequestMiddleware = (request: any) => any;
export type ResponseMiddleware = (response: any) => any;
