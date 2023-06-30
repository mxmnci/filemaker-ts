import * as dotenv from 'dotenv';
import {
  FilemakerDataAPIOptions,
  LoggingConfig,
  RequestMiddleware,
  ResponseMiddleware,
} from './types';
import { logger } from './logger';
import winston from 'winston';
import { FileMakerRequestHandler } from './requestHandler';
import { RecordAPI } from './apis/RecordAPI';
import { FindAPI } from './apis/FindAPI';
import { AuthAPI } from './apis/AuthAPI';
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

  private recordAPI = new RecordAPI();
  private findAPI = new FindAPI();
  private authAPI = new AuthAPI();

  constructor(options: FilemakerDataAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.username = options.username;
    this.password = options.password;
    this.requestMiddleware = options.requestMiddleware;
    this.responseMiddleware = options.responseMiddleware;

    // Configure logging
    if (options.loggingConfig) this.configureLogging(options.loggingConfig);
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
  public createRequestHandler(
    layout: string,
    requestMiddleware?: RequestMiddleware,
    responseMiddleware?: ResponseMiddleware
  ) {
    return new FileMakerRequestHandler({
      username: this.username,
      password: this.password,
      host: this.host,
      database: this.database,
      layout,
      requestMiddleware,
      responseMiddleware,
      globalRequestMiddleware: this.requestMiddleware,
      globalResponseMiddleware: this.responseMiddleware,
    });
  }

  /**
   * Configure debug logging for winston
   * @param config The logging config
   */
  private configureLogging(config: LoggingConfig): void {
    if (config.logDebugToConsole) {
      logger.add(
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(info => `filemaker-ts: ${info.message}`)
          ),
        })
      );
    } else if (config.logCombinedToFile) {
      logger.add(
        new winston.transports.File({
          filename: 'combined.log',
        })
      );
    } else if (config.logErrorsToFile) {
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
}
