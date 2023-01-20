import { FMAxiosConfig } from './FMAxios';

export * from './request';
export * from './response';

export type FilemakerDataAPIOptions = {
  host: string;
  database: string;
  layout: string;
  username: string;
  password: string;
  config?: {
    logDebugToConsole?: boolean;
    logCombinedToFile?: boolean;
    logErrorsToFile?: boolean;
  };
};

export type HttpConfig = {
  axios?: FMAxiosConfig;
  withoutLayout?: boolean;
  noAuth?: boolean;
};
