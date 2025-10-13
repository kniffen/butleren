import { deleteTwitchChannelsHandler } from './deleteTwitchChannelsHandler';
import type { Request, Response } from 'express';
import * as getDBEntry from '../../../database/utils/getDBEntry';
import * as deleteDBEntry from '../../../database/utils/deleteDBEntry';

describe('Twitch: deleteTwitchChannelsHandler()', () => {
  const getDBEntryMock    = jest.spyOn(getDBEntry, 'getDBEntry').mockImplementation();
  const deleteDBEntryMock = jest.spyOn(deleteDBEntry, 'deleteDBEntry').mockResolvedValue();

  const req = { params: { guildId: 'guild-id-1', id: '1234' } } as unknown as Request;
  const res = { sendStatus: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should remove an entry from the database channels into the database', async () => {
    const entry = {
      guildId:               'guild-id-1',
      id:                    '1234',
      notificationChannelId: 'channel-id-1',
      notificationRoleId:    'role-id-1'
    };
    getDBEntryMock.mockResolvedValueOnce(entry);
    await deleteTwitchChannelsHandler(req, res, nextSpy);

    expect(deleteDBEntryMock).toHaveBeenCalledWith('twitchChannels', { guildId: 'guild-id-1', id: '1234' });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should respond with 404 if the entry does not exist', async () => {
    getDBEntryMock.mockResolvedValueOnce(undefined);
    await deleteTwitchChannelsHandler(req, res, nextSpy);
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });


  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    getDBEntryMock.mockRejectedValueOnce(error);
    await deleteTwitchChannelsHandler(req, res, nextSpy);

    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});
