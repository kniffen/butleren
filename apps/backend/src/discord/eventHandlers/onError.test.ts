import * as logger from '../../modules/logs/logger';
import { onError } from './onError';

describe('Discord: onError', () => {
  test('It should log the error', () => {
    const err = new Error('Test error');
    onError(err);
    expect(logger.logError).toHaveBeenCalledWith('Discord', 'Test error', err);
  });
});