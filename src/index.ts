import { fmAxios } from './helpers/fmAxios';
import { FMAuthMethod } from './types/FMAxios';
import { AuthAPI } from './apis/AuthAPI';

import * as dotenv from 'dotenv';
import { RecordAPI } from './apis/RecordAPI';
import { Method } from 'axios';
import { FindAPI } from './apis/FindAPI';
import { FilemakerDataAPIOptions, HttpConfig } from './types';
import { logger } from './logger';
import winston from 'winston';
dotenv.config();

export * from './types';

export class FilemakerDataAPI {
  private host: string;
  private database: string;
  private layout: string;
  private username: string;
  private password: string;

  public auth: AuthAPI;
  public records: RecordAPI;
  public find: FindAPI;

  constructor(options: FilemakerDataAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.layout = options.layout;
    this.username = options.username;
    this.password = options.password;

    this.auth = new AuthAPI(this);
    this.records = new RecordAPI(this);
    this.find = new FindAPI(this);

    const { config } = options;

    // Configure logging
    if (config?.logDebugToConsole) {
      logger.add(
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(info => `filemaker-ts: ${info.message}`)
          ),
        })
      );
    } else if (config?.logCombinedToFile) {
      logger.add(
        new winston.transports.File({
          filename: 'combined.log',
        })
      );
    } else if (config?.logErrorsToFile) {
      logger.add(
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
        })
      );
    } else {
      logger.silent = true;
    }
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

  /**
   * Get the base url for the current host, database and layout
   * @param options The options to use
   * @returns The base url
   */
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

    const response = await fmAxios<ResponseType, RequestDataType>({
      baseURL: this.getBaseURL({ withoutLayout: config?.withoutLayout }),
      url,
      method,
      data,
      auth: {
        method: FMAuthMethod.BEARER,
        token: accessToken,
      },
      config: config ? config.axios : undefined,
    });

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
