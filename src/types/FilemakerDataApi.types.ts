import { FMAxiosConfig } from './FMAxios.types';

export * from './request.types';
export * from './response.types';

export type FilemakerDataAPIOptions = {
  host: string;
  database: string;
  layout: string;
  username: string;
  password: string;
};

export type HttpConfig = {
  axios?: FMAxiosConfig;
  withoutLayout?: boolean;
  noAuth?: boolean;
};

export type GetRecordRangeParams = {
  offset?: number;
  limit?: number;
};
