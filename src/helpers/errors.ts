export class FilemakerDataAPIError extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'FilemakerDataAPIError';
    this.code = code;
  }
}

export class FilemakerTSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FilemakerTSError';
  }
}
