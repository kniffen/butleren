import crypto from 'node:crypto';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { colors } from './colors';
import { LOGS_PATH } from '../../constants';

export const logger = winston.createLogger({
  level:  'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format((info) => ({ ...info, id: crypto.randomUUID() }))(),

    winston.format.printf(({ id, timestamp, level, message, service, botModule, ...rest }) => JSON.stringify({ id, timestamp, level, service, module: botModule, message, ...rest }, null, 3)),
  ),
  defaultMeta: { service: 'unknown' },
  transports:  [
    new DailyRotateFile({
      filename:    `${LOGS_PATH}/info-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '30d',
      level:       'info'
    }),
    new DailyRotateFile({
      filename:    `${LOGS_PATH}/error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '30d',
      level:       'error'
    }),
    new DailyRotateFile({
      filename:    `${LOGS_PATH}/debug-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '30d',
      level:       'debug'
    }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf((info) => {
      const timestamp = formatText(info.timestamp, colors.yellow, 0);
      const level     = `[${info.level}]`.padEnd(17);
      const service   = formatText(info.service   || 'Unknown', colors[info.service   as string] || colors.reset, 12);
      const message   = info.message;

      return `${timestamp} ${level}\t${service} ${message}`;
    })
  )
}));

const formatText = (text: unknown, color: string, minLength: number): string | unknown => {
  const textStr = String(text);
  return `${color}${textStr.padEnd(minLength)}${colors.reset}`;
};

export const logInfo = (service: string, message: string, rest?: unknown): void => {
  logger.info(message, { service, rest });
};

export const logError = (service: string, message: string, rest?: unknown): void => {
  logger.error(message, { service, rest });
};

export const logWarn = (service: string, message: string, rest?: unknown): void => {
  logger.warn(message, { service, rest });
};

export const logDebug = (service: string, message: string, rest?: unknown): void => {
  logger.debug(message, { service, rest });
};