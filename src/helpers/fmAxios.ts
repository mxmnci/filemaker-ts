import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FMAxiosParams } from '../types/FMAxios';
import { getAuthString } from './utils/getAuthString.util';
import {
  handleFileMakerDataAPIException,
  isFileMakerErrorResponse,
} from './utils/exception.util';
import { logger } from '../logger';

// Use Node.js adapter for Axios
axios.defaults.adapter = require('axios/lib/adapters/http');

export async function fmAxios<ResponseType, RequestDataType = any>(
  params: FMAxiosParams<RequestDataType>
): Promise<AxiosResponse<ResponseType>['data'] | null> {
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
        // Return null if no records are found
        if (
          error.response.data.messages &&
          error.response.data.messages[0].code === '401'
        ) {
          return null;
        }

        throw handleFileMakerDataAPIException(error.response.data);
      }
    }

    // Handle unknown errors
    logger.log('error', 'An unknown error ocurred', error);
    throw error;
  }
}
