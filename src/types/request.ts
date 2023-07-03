// Parameters for FileMaker HTTP requests
export type Query<T> = {
  [key in keyof T]: T[key];
};

export type Sort<T> = {
  fieldName: keyof T;
  sortOrder: 'ascend' | 'descend' | string;
};

export type FindRequestParams<T> = {
  query: Query<Partial<T> & { omit?: 'true' | 'false' }>[];
  portal?: string[];
  limit?: string;
  offset?: number;
  sort?: Sort<Partial<T>>[];
};

export type GetRecordRangeParams = {
  offset?: number;
  limit?: number;
};

export interface CreateRecordRequest<Entity> {
  fieldData: Partial<Entity>;
}

export interface UpdateRecordRequest<Entity> {
  fieldData: Partial<Entity>;
}
