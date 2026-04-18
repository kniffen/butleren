import type { Request, Response } from 'express';
import { getCommands } from './getCommands';
import { discordClient } from '../../../discord/client';
import * as getDBEntry from '../../../database/utils/getDBEntry';
import { CommandDBEntry } from '../../../types';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

jest.mock('../../modules', () => ({
  commands: new Map([
    ['foo', { isLocked: false, slashCommandBuilder: { description: 'Foo command'  } }],
    ['bar', { isLocked: true,  slashCommandBuilder: { description: 'Bar command'  } }],
  ]),
}));

describe('getCommands()', () => {
  const fetchGuildMock = jest.spyOn(discordClient.guilds, 'fetch');
  const req = { path: '/foo/bar' } as unknown as Request;
  const res = { status: jest.fn(() => res), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();
  const getDBEntryMock = jest.spyOn(getDBEntry, 'getDBEntry');

  beforeEach(async () => {
    jest.clearAllMocks();
    req.params = {};;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get commands and their details for a guild', async () => {
    const guild = { id: '12345' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);
    getDBEntryMock.mockResolvedValueOnce({ isEnabled: 0 } as CommandDBEntry);
    getDBEntryMock.mockResolvedValueOnce({ isEnabled: 1 } as CommandDBEntry);

    req.params['guild'] = '12345';
    await getCommands(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(getDBEntryMock).toHaveBeenCalledTimes(2);
    expect(getDBEntryMock).toHaveBeenNthCalledWith(1, 'commands', { slug: 'foo', guildId: guild.id });
    expect(getDBEntryMock).toHaveBeenNthCalledWith(2, 'commands', { slug: 'bar', guildId: guild.id });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { slug: 'foo', description: 'Foo command', isEnabled: false, isLocked: false },
      { slug: 'bar', description: 'Bar command', isEnabled: true,  isLocked: true  },
    ]);
  });

  test('It pass the error to the next function if it occurs while fetching modules', async () => {
    const error = new Error('Test error');
    fetchGuildMock.mockRejectedValue(error);

    req.params['guild'] = '12345';
    await getCommands(req, res, nextSpy);
    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});