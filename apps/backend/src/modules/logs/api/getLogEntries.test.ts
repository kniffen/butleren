import fs from 'node:fs';
import type { Request, Response } from 'express';
import { getLogEntries } from './getLogEntries';

jest.mock('node:fs', () => ({
  existsSync:   (): void => {},
  readFileSync: (): void => {},
}));

describe('getLogEntries()', () => {
  const existsSyncSpy   = jest.spyOn(fs, 'existsSync');
  const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
  const nextSpy         = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get log entries for a specific date', async () => {
    const logs = [{ foo: 'bar' }, { baz: 'qux' }];
    existsSyncSpy.mockReturnValueOnce(true);
    readFileSyncSpy.mockReturnValueOnce(`${JSON.stringify(logs[0])}\n${JSON.stringify(logs[1])}`);

    await getLogEntries(request, response, nextSpy);

    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).toHaveBeenCalledWith(logs);
  });

  test('It should return 400 if date query parameters is missing', async () => {
    const req = { query: {} } as unknown as Request;
    await getLogEntries(req, response, nextSpy);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith('Missing date parameter');
  });

  test('It should return 404 if log file not found', async () => {
    existsSyncSpy.mockReturnValueOnce(false);
    await getLogEntries(request, response, nextSpy);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith('Log file not found');
  });

  test('It pass an error to the next function if it occurs while reading or parsing the log file', async () => {
    const error = new Error('File read error');
    existsSyncSpy.mockReturnValueOnce(true);
    readFileSyncSpy.mockImplementationOnce(() => {
      throw error;
    });
    await getLogEntries(request, response, nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const request = {
  query: { date: '2000-01-01' },
} as unknown as Request;

const response = {
  status: jest.fn().mockReturnThis(),
  send:   jest.fn(),
  json:   jest.fn(),
} as unknown as Response;