export interface FMResponse<ResponseDataType> {
  response: ResponseDataType;
  messages: {
    code: string;
    message: string;
  }[];
}
