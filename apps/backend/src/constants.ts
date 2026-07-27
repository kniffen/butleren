import path from 'node:path';

export const PORT = process.env.PORT || 3000;
export const LOGS_PATH = process.env.LOGS_PATH!;

export const ROOT_PATH = 'development' === process.env.NODE_ENV
  ? path.resolve(__dirname, '../../..')
  : path.resolve(__dirname, '..');

export const STATIC_PATH = path.resolve(ROOT_PATH, 'dist/public');