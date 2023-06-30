import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FMAxiosParams } from '../types/FMAxios';
import { getAuthString } from './utils/getAuthString.util';
import {
  handleFileMakerDataAPIException,
  isFileMakerErrorResponse,
} from './utils/exception.util';
import { logger } from '../logger';

export async function fmAxios<ResponseType, RequestDataType = any>(
  params: FMAxiosParams<RequestDataType>
): Promise<AxiosResponse<ResponseType>['data']> {
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle FileMaker Data API errors
      if (error.response && isFileMakerErrorResponse(error.response)) {
        throw handleFileMakerDataAPIException(error.response.data);
      }

      // Handle other Axios errors
      throw new Error(error.message);
    }

    // Handle unknown errors
    logger.log('error', 'An unknown error ocurred', error);
    throw error;
  }
}
