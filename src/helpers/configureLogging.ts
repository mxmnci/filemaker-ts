import winston from 'winston';
import { logger } from '../logger';
import { LoggingConfig } from '../types';

/**
 * Configure logging for winston
 * @param config
 */
export function configureLogging(config: LoggingConfig = {}): void {
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
