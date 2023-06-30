import { AxiosResponse } from 'axios';
import { ErrorResponse, FilemakerDataAPIException } from '../../types';

export function isFileMakerErrorResponse(
  axiosError: AxiosResponse<unknown>
): axiosError is AxiosResponse<ErrorResponse> {
  const x = axiosError.data;

  if (x && typeof x === 'object' && 'messages' in x && 'response' in x) {
    return true;
  }

  return false;
}

export function handleFileMakerDataAPIException(response: ErrorResponse) {
  const errorCode = response.messages[0].code;
  const errorMessage = response.messages[0].message;

  return new FilemakerDataAPIException(errorCode, errorMessage);
}
