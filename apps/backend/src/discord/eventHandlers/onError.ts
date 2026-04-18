import { logError } from '../../modules/logs/logger';

export const onError = (err: Error): void => {
  logError('Discord', err.message, err);
};