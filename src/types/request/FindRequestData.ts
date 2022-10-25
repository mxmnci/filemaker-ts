type Query<T> = {
  [key in keyof T]: string;
};

export type FindRequestData<T> = {
  query: Query<Partial<T>>[];
  portal?: string[];
  limit?: string;
  offset?: string;
};
