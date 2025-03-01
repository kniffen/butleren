import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { colors } from './colors';

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, service, ...rest }) => JSON.stringify({timestamp, level, message, ...rest}, null, 3)),
  ),
  defaultMeta: { service: 'unknown' },
  transports: [
    new DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'info'
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'error'
    }),
    new DailyRotateFile({
      filename: 'logs/debug-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      level: 'debug'
    }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, service, message }) => {
      const serviceColor = colors[service as string] || colors.reset;
      return `${colors.yellow}${timestamp}${colors.reset} [${level}] ${serviceColor}${service}${colors.reset}: ${message}`;
    })
  )
}));

export const logInfo = (service: string, message: string, rest?: unknown) => {
  logger.info(message, { service, rest });
};

export const logError = (service: string, message: string, rest?: unknown) => {
  logger.error(message, { service, rest });
};

export const logWarn = (service: string, message: string, rest?: unknown) => {
  logger.warn(message, { service, rest });
};

export const logDebug = (service: string, message: string, rest?: unknown) => {
  logger.debug(message, { service, rest });
};