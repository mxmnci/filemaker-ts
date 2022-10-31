type Query<T> = {
  [key in keyof T]: T[key];
};

export type FindRequestData<T> = {
  query: Query<Partial<T>>[];
  portal?: string[];
  limit?: string;
  offset?: string;
};
