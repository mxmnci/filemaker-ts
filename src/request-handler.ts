import { Method } from 'axios';
import { fmAxios } from './helpers/fmAxios';
import { HttpConfig, RequestMiddleware, ResponseMiddleware } from './types';
import { AuthAPI } from './apis/AuthAPI';
import { FMAuthMethod } from './types/FMAxios';
import { RecordAPI } from './apis/RecordAPI';
import { FindAPI } from './apis/FindAPI';

type RequestHandlerOptions = {
  host: string;
  database: string;
  username: string;
  password: string;
  layout: string;
  requestMiddleware?: RequestMiddleware;
  responseMiddleware?: ResponseMiddleware;
};

export class FileMakerRequestHandler {
  private username: string;
  private password: string;
  private host: string;
  private database: string;
  private layout: string;

  public auth: AuthAPI;
  public records: RecordAPI;
  public find: FindAPI;

  private requestMiddleware?: RequestMiddleware;
  private responseMiddleware?: ResponseMiddleware;

  constructor(options: RequestHandlerOptions) {
    this.username = options.username;
    this.password = options.password;
    this.host = options.host;
    this.database = options.database;
    this.layout = options.layout;

    this.auth = new AuthAPI(this);
    this.records = new RecordAPI(this);
    this.find = new FindAPI(this);

    this.requestMiddleware = options.requestMiddleware;
    this.responseMiddleware = options.responseMiddleware;
  }

  /**
   * Get the base url for the current host, database and layout
   * @param options The options to use
   * @returns The base url
   */
  public getBaseURL(layout?: string) {
    if (!layout) {
      return `${this.host}/fmi/data/v1/databases/${this.database}`;
    }

    return `${this.host}/fmi/data/v1/databases/${this.database}/layouts/${this.layout}`;
  }

  /**
   * An http request wrapper that handles authentication automatically
   * @param url The url to send the request to
   * @param method The http method to use
   * @param data The data to send with the request
   * @param config The axios config
   * @returns The response from the request
   */
  private async http<ResponseType, RequestDataType>(
    url: string,
    method: Method,
    data?: RequestDataType,
    config?: HttpConfig
  ) {
    const accessToken = await this.auth.login(this.username, this.password);

    if (this.requestMiddleware) {
      data = this.requestMiddleware(data);
    }

    let response = await fmAxios<ResponseType, RequestDataType>({
      baseURL: this.getBaseURL(this.layout),
      url,
      method,
      data,
      auth: {
        method: FMAuthMethod.BEARER,
        token: accessToken,
      },
      config: config ? config.axios : undefined,
    });

    if (this.responseMiddleware) {
      response = this.responseMiddleware(response);
    }

    return response;
  }

  public async get<ResponseType, RequestDataType = any>(
    url: string,
    data?: RequestDataType,
    config?: HttpConfig
  ) {
    return this.http<ResponseType, RequestDataType>(url, 'GET', data, config);
  }

  public async post<ResponseType, RequestDataType>(
    url: string,
    data?: RequestDataType,
    config?: HttpConfig
  ) {
    return this.http<ResponseType, RequestDataType>(url, 'POST', data, config);
  }

  public async patch<ResponseType, RequestDataType>(
    url: string,
    data?: RequestDataType,
    config?: HttpConfig
  ) {
    return this.http<ResponseType, RequestDataType>(url, 'PATCH', data, config);
  }

  public async delete<ResponseType, RequestDataType = any>(
    url: string,
    data?: RequestDataType,
    config?: HttpConfig
  ) {
    return this.http<ResponseType, RequestDataType>(
      url,
      'DELETE',
      data,
      config
    );
  }
}
