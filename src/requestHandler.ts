import { Method } from 'axios';
import { fmAxios } from './helpers/fmAxios';
import { HttpConfig, RequestMiddleware, ResponseMiddleware } from './types';
import { FMAuthMethod } from './types/FMAxios';
import { RecordAPI } from './apis/RecordAPI';
import { FindAPI } from './apis/FindAPI';
import { getBaseURL } from './helpers/utils/url.util';
import { AuthAPI } from './apis/AuthAPI';

type RequestHandlerOptions = {
  host: string;
  database: string;
  username: string;
  password: string;
  layout: string;
  requestMiddleware?: RequestMiddleware;
  responseMiddleware?: ResponseMiddleware;
  globalRequestMiddleware?: RequestMiddleware;
  globalResponseMiddleware?: ResponseMiddleware;
};

export class FileMakerRequestHandler {
  private username: string;
  private password: string;
  private host: string;
  private database: string;
  private layout: string;

  public records: RecordAPI;
  public find: FindAPI;
  private auth: AuthAPI;

  private requestMiddleware?: RequestMiddleware;
  private responseMiddleware?: ResponseMiddleware;
  private globalRequestMiddleware?: RequestMiddleware;
  private globalResponseMiddleware?: ResponseMiddleware;

  constructor(options: RequestHandlerOptions) {
    this.username = options.username;
    this.password = options.password;
    this.host = options.host;
    this.database = options.database;
    this.layout = options.layout;

    this.records = new RecordAPI(this);
    this.find = new FindAPI(this);
    this.auth = new AuthAPI();

    this.requestMiddleware = options.requestMiddleware;
    this.responseMiddleware = options.responseMiddleware;
    this.globalRequestMiddleware = options.globalRequestMiddleware;
    this.globalResponseMiddleware = options.globalResponseMiddleware;
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
    // Get an access token
    const accessToken = await this.auth.login(this.username, this.password);

    // Apply request middleware
    if (this.requestMiddleware) {
      data = this.requestMiddleware(data);
    }
    if (this.globalRequestMiddleware) {
      data = this.globalRequestMiddleware(data);
    }

    // Send the request
    let response = await fmAxios<ResponseType, RequestDataType>({
      baseURL: getBaseURL({
        host: this.host,
        database: this.database,
        layout: this.layout,
      }),
      url,
      method,
      data,
      auth: {
        method: FMAuthMethod.BEARER,
        token: accessToken,
      },
      config: config ? config.axios : undefined,
    });

    // Apply response middleware
    if (this.responseMiddleware) {
      response = this.responseMiddleware(response);
    }
    if (this.globalResponseMiddleware) {
      response = this.globalResponseMiddleware(response);
    }

    // Reset the access token timer
    this.auth.resetAccessTokenTimer();

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
