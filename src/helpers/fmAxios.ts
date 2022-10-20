import axios, { AxiosRequestConfig } from 'axios';
import { FMAuth, FMAxiosParams } from '../types/FMAxios';

export async function fmAxios<T>(params: FMAxiosParams) {
  const { baseURL, url, method, auth, config } = params;
  const { contentType, ...axiosConfig } = config ?? {};

  const request: AxiosRequestConfig = {
    baseURL,
    url,
    method,
    headers: {
      Authorization: getAuthString(auth),
      'Content-Type': contentType ?? 'application/json',
    },
    ...axiosConfig,
  };

  const response = await axios(request);

  return response.data as T;
}

function getAuthString(auth: FMAuth): string {
  switch (auth.method) {
    case 'BASIC':
      return `Basic ${auth.token}`;

    case 'BEARER':
      return `Bearer ${auth.token}`;

    default:
      throw new Error('Invalid auth type');
  }
}
