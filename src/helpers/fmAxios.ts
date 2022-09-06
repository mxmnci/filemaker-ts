import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { BASE_API_URL } from '../constants';

export type FMAxiosConfig = AxiosRequestConfig & { contentType?: string };

export async function fmAxios<T>(
  url: string,
  method: Method,
  authToken: string,
  config?: FMAxiosConfig
) {
  try {
    const { contentType, ...axiosConfig } = config ?? {};

    const response = await axios({
      ...axiosConfig,
      baseURL: BASE_API_URL,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': contentType ?? 'application/json',
      },
      url,
      method,
    });

    return response.data as T;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.message);
  }
}
