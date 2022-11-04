import { FMAxiosConfig } from './FMAxios';

export * from './request';
export * from './response';

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
