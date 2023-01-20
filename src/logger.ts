import * as winston from 'winston';

export const consoleDebugLogging = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(info => `filemaker-ts: ${info.message}`)
  ),
});
export const fileCombinedLogging = new winston.transports.File({
  filename: 'combined.log',
});
export const fileErrorLogging = new winston.transports.File({
  filename: 'error.log',
  level: 'error',
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'filemaker-ts' },
});
