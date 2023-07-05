import * as dotenv from 'dotenv';
import {
  FilemakerDataAPIOptions,
  RequestMiddleware,
  ResponseMiddleware,
} from './types';
import { FileMakerRequestHandler } from './requestHandler';
import { AuthAPI } from './apis/AuthAPI';
import { configureLogging } from './helpers/configureLogging';
dotenv.config();

export * from './types';
export * from './requestHandler';

export class FileMakerDataAPI {
  private host: string;
  private database: string;
  private username: string;
  private password: string;
  private requestMiddleware?: RequestMiddleware;
  private responseMiddleware?: ResponseMiddleware;

  public auth: AuthAPI;

  constructor(options: FilemakerDataAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.username = options.username;
    this.password = options.password;
    this.requestMiddleware = options.requestMiddleware;
    this.responseMiddleware = options.responseMiddleware;

    this.auth = new AuthAPI({
      host: options.host,
      database: options.database,
      username: options.username,
      password: options.password,
    });

    // Configure logging
    configureLogging(options.loggingConfig);
  }

  /**
   * Get the hostname
   * @returns The hostname
   */
  public getHost() {
    return this.host;
  }

  /**
   * Get the database name
   * @returns The database name
   */
  public getDatabase() {
    return this.database;
  }

  /**
   * Create a request handler for a specific layout
   * @param layout The layout to use for the request handler
   * @param requestMiddleware The request middleware to use for the request handler
   * @param responseMiddleware The response middleware to use for the request handler
   * @returns The request handler
   */
  public createRequestHandler<T>(
    layout: string,
    requestMiddleware?: RequestMiddleware,
    responseMiddleware?: ResponseMiddleware
  ) {
    return new FileMakerRequestHandler<T>({
      username: this.username,
      password: this.password,
      host: this.host,
      database: this.database,
      layout,
      requestMiddleware,
      responseMiddleware,
      globalRequestMiddleware: this.requestMiddleware,
      globalResponseMiddleware: this.responseMiddleware,
      auth: this.auth,
    });
  }
}
