import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';

export type FMAxiosConfig = AxiosRequestConfig & { contentType?: string };

export async function fmAxios<T>(
  baseURL: string,
  url: string,
  method: Method,
  authToken: string,
  config?: FMAxiosConfig
) {
  try {
    const { contentType, ...axiosConfig } = config ?? {};

    if (!authToken && !axiosConfig.headers) {
      throw new Error('Missing auth token or custom header');
    }

    const request: AxiosRequestConfig = {
      baseURL,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': contentType ?? 'application/json',
      },
      url,
      method,
      ...axiosConfig,
    };

    console.log(
      `${method} - ${baseURL}${url}\n${JSON.stringify(request)}`,
      null,
      '\t'
    );

    const response = await axios(request);

    return response.data as T;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.message);
  }
}
