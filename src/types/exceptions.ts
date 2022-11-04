export class FilemakerDataAPIException extends Error {
  public code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'FilemakerDataAPIException';
    this.code = code;
  }
}

export class FilemakerTSException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FilemakerTSException';
  }
}
