import { DiscordAPIError } from 'discord.js';
import { errorHandler } from './errorHandler';
import type { Request, Response } from 'express';
import * as logger from '../modules/logs/logger';

describe('errorHandler() middleware', () => {
  const logErrorSpy = jest.spyOn(logger, 'logError').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should handle DiscordAPIError with 404 status', () => {
    const error = Object.create(DiscordAPIError.prototype);
    error.status = 404;
    error.message = 'Not found';
    errorHandler(error, req, res, next);

    expect(logErrorSpy).toHaveBeenCalledWith('',  'Not found', { path: req.path });
    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalled();
  });

  test('It should handle other DiscordAPIError', () => {
    const error = Object.create(DiscordAPIError.prototype);
    error.status = 500;
    error.message = 'Internal Server Error';
    errorHandler(error, req, res, next);

    expect(logErrorSpy).toHaveBeenCalledWith('',  'Internal Server Error', { path: req.path, error });
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(next).toHaveBeenCalled();
  });

  test('It should handle generic Error', () => {
    const error = new Error('Something went wrong');
    errorHandler(error, req, res, next);

    expect(logErrorSpy).toHaveBeenCalledWith('', 'Something went wrong', { path: req.path, error });
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(next).toHaveBeenCalled();
  });
});

const req = { path: '/test/path' } as Request;
const res = { sendStatus: jest.fn() } as unknown as Response;
const next = jest.fn();
