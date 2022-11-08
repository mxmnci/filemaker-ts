import { AxiosResponse } from 'axios';
import { EmptyResponse, FilemakerDataAPIException } from '../types';

export function isFilemakerDataAPIException(
  x: unknown
): x is FilemakerDataAPIException {
  if (x && typeof x === 'object' && 'code' in x && 'name' in x) {
    return true;
  }

  return false;
}

export function isFilemakerTSException(
  x: unknown
): x is FilemakerDataAPIException {
  if (x && typeof x === 'object' && 'name' in x) {
    return true;
  }

  return false;
}

export function handleDataAPIException(response: AxiosResponse<EmptyResponse>) {
  const errorCode = response.data.messages[0].code;
  const errorMessage = response.data.messages[0].message;

  if (errorCode === '401') {
    return null;
  }

  throw new FilemakerDataAPIException(errorCode, errorMessage);
}
