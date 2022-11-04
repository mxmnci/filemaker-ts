export interface AuthResponse extends FMResponse<AuthResponseData> {}

export interface AuthResponseData {
  token: string;
}

export interface EmptyResponse extends FMResponse<{}> {}

export interface Entity<T> {
  fieldData: T;
  recordId: string;
  modId: string;
  portalData: {
    [key: string]: unknown;
  };
}

export interface EntityResponse<T> extends FMResponse<EntityResponseData<T>> {}

export interface EntityResponseData<T> {
  dataInfo: FMDataInfo;
  data: Entity<T>[];
}

export type FMDataInfo = {
  database: string;
  layout: string;
  table: string;
  totalRecordCount: number;
  foundCount: number;
  returnedCount: number;
};

export interface FMResponse<ResponseDataType> {
  response: ResponseDataType;
  messages: {
    code: string;
    message: string;
  }[];
}
