import { FMDataInfo } from './FMDataInfo';
import { FMRequestEntity } from './FMRequestEntity';

export type FMRequestBody = {
  response: {
    dataInfo?: FMDataInfo;
    data: FMRequestEntity[];
    token?: string;
  };
  messages?: {
    code: string;
    message: string;
  }[];
};
