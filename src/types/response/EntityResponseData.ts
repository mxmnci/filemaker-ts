import { Entity } from './Entity';
import { FMDataInfo } from './FMDataInfo';

export interface EntityResponseData<T> {
  dataInfo: FMDataInfo;
  data: Entity<T>[];
}
