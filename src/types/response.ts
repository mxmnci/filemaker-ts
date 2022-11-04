// Base filemaker response types
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

// Empty response type
export interface EmptyResponse extends FMResponse<{}> {}

// Auth response types
export interface AuthResponseData {
  token: string;
}

export interface AuthResponse extends FMResponse<AuthResponseData> {}

// Entity response types
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

// Create record response types
export interface CreateRecordResponseData {
  recordId: string;
  modId: string;
}

export interface CreateRecordResponse
  extends FMResponse<CreateRecordResponseData> {}

// Update record response types
export interface UpdateRecordResponseData {
  modId: string;
}

export interface UpdateRecordResponse
  extends FMResponse<UpdateRecordResponseData> {}
