import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { BASE_API_URL } from '../constants';
import { encodeToBase64 } from './encodeToBase64';

export type FMAxiosConfig = AxiosRequestConfig & { contentType?: string };
type FMAxiosOptions = {
  url: string;
  method: Method;
  user: string;
  password: string;
  host: string;
  database: string;
  layout: string;
  config?: FMAxiosConfig;
};

export async function fmAxios<T>(options: FMAxiosOptions) {
  try {
    const { url, method, user, password, config } = options;
    const { contentType, ...fmConfig } = config ?? {};

    const encodedUserAndPassword = encodeToBase64(`${user}:${password}`);

    const response = await axios({
      ...fmConfig,
      baseURL: BASE_API_URL,
      headers: {
        Authorization: `Basic ${encodedUserAndPassword}`,
        'Content-Type': contentType ?? 'application/json',
      },
      //   paramsSerializer,
      url,
      method,
    });

    return response.data as T;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.message);
  }
}

// export function paramsSerializer(params: any) {
//   return qs.stringify(params, { arrayFormat: 'comma' });
// }
