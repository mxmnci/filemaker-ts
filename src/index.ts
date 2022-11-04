import { generateEncodedAuthString } from './helpers/encode';
import { fmAxios } from './helpers/fmAxios';
import { FMAuthMethod } from './types/FMAxios';
import { AuthAPI } from './apis/AuthAPI';

import * as dotenv from 'dotenv';
import { RecordAPI } from './apis/RecordAPI';
import { Method } from 'axios';
import { FindAPI } from './apis/FindAPI';
import { FilemakerDataAPIOptions, HttpConfig } from './types';
dotenv.config();

export * from './types';

export class FilemakerDataAPI {
  private host: string;
  private database: string;
  private layout: string;
  private username: string;
  private password: string;

  private authToken: string;
  private tokenExpired: boolean;

  public auth: AuthAPI;
  public records: RecordAPI;
  public find: FindAPI;

  private authTimeout: NodeJS.Timeout;

  constructor(options: FilemakerDataAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.layout = options.layout;
    this.username = options.username;
    this.password = options.password;

    this.authToken = generateEncodedAuthString(this.username, this.password);
    this.authTimeout = this.createAuthTimeout();
    this.tokenExpired = true;

    this.auth = new AuthAPI(this);
    this.records = new RecordAPI(this);
    this.find = new FindAPI(this);
  }

  public getHost() {
    return this.host;
  }

  public getDatabase() {
    return this.database;
  }

  public getLayout() {
    return this.layout;
  }

  public getBaseURL({ withoutLayout = false } = {}) {
    if (withoutLayout) {
      return `${this.host}/fmi/data/v1/databases/${this.database}`;
    }

    return `${this.host}/fmi/data/v1/databases/${this.database}/layouts/${this.layout}`;
  }

  public setHost(host: string) {
    this.host = host;
  }

  public setDatabase(database: string) {
    this.database = database;
  }

  public setLayout(layout: string) {
    this.layout = layout;
  }

  public setAuthToken(authToken: string) {
    this.authToken = authToken;
  }

  private async http<ResponseType, RequestDataType>(
    url: string,
    method: Method,
    data?: RequestDataType,
    config?: HttpConfig
  ) {
    return fmAxios<ResponseType, RequestDataType>({
      baseURL: this.getBaseURL({ withoutLayout: config?.withoutLayout }),
      url,
      method,
      data,
      auth: {
        method: FMAuthMethod.BEARER,
        token: await this.getAuthToken(),
      },
      config: config ? config.axios : undefined,
    });
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

  /**
   * Refresh the filemaker auth token if it has exceeded the 15 minute timeout
   * Otherwise, refresh the timeout of the existing token
   * @returns The auth token
   */
  public async getAuthToken() {
    if (this.tokenExpired) {
      console.log('Getting a new auth token...');
      this.authToken = await this.auth.login(this.username, this.password);

      console.log(`Successfully logged in!\nToken: ${this.authToken}`);
      this.tokenExpired = false;
    } else {
      this.authTimeout.refresh();
    }

    return this.authToken;
  }

  private createAuthTimeout() {
    return setTimeout(() => {
      this.tokenExpired = true;
    }, 1000 * 60 * 15);
  }
}
