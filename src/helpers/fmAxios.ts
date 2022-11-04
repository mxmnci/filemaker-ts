import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FMAxiosParams } from '../types/FMAxios';
import { EmptyResponse } from '../types/response';
import { getAuthString } from './getAuthString';
import { FilemakerDataAPIException } from '../types/exceptions';

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

  try {
    const response: AxiosResponse<ResponseType> = await axios(request);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const response = err.response as AxiosResponse<EmptyResponse>;
      const errorCode = response.data.messages[0].code;
      const errorMessage = response.data.messages[0].message;

      throw new FilemakerDataAPIException(errorCode, errorMessage);
    }
  }

  throw new Error('An unexpected error occurred');
}
