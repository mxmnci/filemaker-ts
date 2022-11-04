import { AxiosResponse } from 'axios';
import { EmptyResponse, FilemakerDataAPIException } from '../types';

export function handleDataAPIException(response: AxiosResponse<EmptyResponse>) {
  const errorCode = response.data.messages[0].code;
  const errorMessage = response.data.messages[0].message;

  throw new FilemakerDataAPIException(errorCode, errorMessage);
}
