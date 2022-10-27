import { FMAxiosConfig } from './FMAxios.types';

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
