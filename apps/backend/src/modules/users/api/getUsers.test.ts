import { getUsers } from './getUsers';
import * as getAllDBEntries from '../../../database/utils/getAllDBEntries';
import { UserDBEntry } from '../../../types';
import type { Request, Response } from 'express';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    users: {
      fetch: jest.fn((id) => ({ displayName: `User #${id}` })),
    },
  }
}));

describe('Users API: GetUSers()', () => {
  const getAllDBEntriesSpy = jest.spyOn(getAllDBEntries, 'getAllDBEntries').mockImplementation();

  const req = { } as Request;
  const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should get a list of users', async () => {
    getAllDBEntriesSpy.mockResolvedValueOnce(userDBEntries);

    await getUsers(req, res, nextSpy);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { id: '123', displayName: 'User #123', settings: { lat: 10, lon: 20, } },
      { id: '456', displayName: 'User #456', settings: { lat: 10, } },
      { id: '789', displayName: 'User #789', settings: { } },
    ]);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async ()=>{
    const error = new Error('Test error');
    getAllDBEntriesSpy.mockRejectedValueOnce(error);

    await getUsers(req, res, nextSpy);

    expect(res.json).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const userDBEntries = [
  { id: '123', lat: 10, lon: 20 },
  { id: '456', lat: 10 },
  { id: '789' },
] as UserDBEntry[];