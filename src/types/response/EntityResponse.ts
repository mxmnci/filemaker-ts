import { EntityResponseData } from './EntityResponseData';
import { FMResponse } from './FMResponse';

export interface EntityResponse<T> extends FMResponse<EntityResponseData<T>> {}
