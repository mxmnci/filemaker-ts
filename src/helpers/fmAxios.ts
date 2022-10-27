import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FMAuth, FMAxiosParams } from '../types/FMAxios.types';

export async function fmAxios<ResponseType, RequestDataType = any>(
  params: FMAxiosParams<RequestDataType>
) {
  const { baseURL, url, method, auth, data, config } = params;
  const { contentType, ...axiosConfig } = config ?? {};

  const request: AxiosRequestConfig<RequestDataType> = {
    baseURL,
    url,
    method,
    data,
    headers: {
      Authorization: getAuthString(auth),
      'Content-Type': contentType ?? 'application/json',
    },
    ...axiosConfig,
  };

  const response: AxiosResponse<ResponseType> = await axios(request);

  return response.data;
}

function getAuthString(auth: FMAuth): string {
  switch (auth.method) {
    case 'BASIC':
      return `Basic ${auth.token}`;

    case 'BEARER':
      return `Bearer ${auth.token}`;

    case 'NONE':
      return '';

    default:
      throw new Error('Invalid auth type');
  }
}
