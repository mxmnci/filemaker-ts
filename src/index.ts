import * as dotenv from 'dotenv';
import {
  FilemakerDataAPIOptions,
  RequestMiddleware,
  ResponseMiddleware,
} from './types';
import { logger } from './logger';
import winston from 'winston';
import { FileMakerRequestHandler } from './request-handler';
dotenv.config();

export * from './types';
export * from './request-handler';

export class FilemakerDataAPI {
  private host: string;
  private database: string;
  private username: string;
  private password: string;
  private requestMiddleware?: RequestMiddleware;
  private responseMiddleware?: ResponseMiddleware;

  constructor(options: FilemakerDataAPIOptions) {
    this.host = options.host;
    this.database = options.database;
    this.username = options.username;
    this.password = options.password;
    this.requestMiddleware = options.requestMiddleware;
    this.responseMiddleware = options.responseMiddleware;

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

  public setHost(host: string) {
    this.host = host;
  }

  public setDatabase(database: string) {
    this.database = database;
  }

  public createRequestHandler(layout: string) {
    return new FileMakerRequestHandler({
      username: this.username,
      password: this.password,
      host: this.host,
      database: this.database,
      layout,
      requestMiddleware: this.requestMiddleware,
      responseMiddleware: this.responseMiddleware,
    });
  }
}
