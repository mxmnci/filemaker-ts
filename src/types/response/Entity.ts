export interface Entity<T> {
  fieldData: T;
  recordId: string;
  modId: string;
  portalData: {
    [key: string]: unknown;
  };
}
