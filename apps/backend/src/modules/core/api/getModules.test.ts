import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import { getModules } from './getModules';
import { database } from '../../../database/database';
import { discordClient } from '../../../discord/client';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

jest.mock('../../modules', () => ({
  modules: new Map([
    [
      'foobar',
      {
        slug:        'foobar',
        name:        'Foo Bar',
        description: 'A test module',
        isLocked:    false,
        commands:    new Map(),
      },
    ],
  ]),
}));

describe('getModules()', () => {
  const fetchGuildMock = jest.spyOn(discordClient.guilds, 'fetch');
  const req = { path: '/foo/bar' } as unknown as Request;
  const res = { status: jest.fn(() => res),sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    req.params = {};

    const db = await database;
    await db.run(
      'INSERT INTO modules (guildId, slug, isEnabled) VALUES (?, ?, ?)',
      '12345',
      'foobar',
      true,
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get all modules and their settings', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue({ id: '12345' } as unknown as Guild);

    req.params['guild'] = '12345';
    await getModules(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{
      slug:        'foobar' ,
      name:        'Foo Bar',
      description: 'A test module',
      isLocked:    false,
      settings:    { isEnabled: true },
    }]);
  });

  test('It pass the error to the next function if it occurs while fetching modules', async () => {
    const error = new Error('Test error');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockRejectedValue(error);

    req.params['guild'] = '12345';
    await getModules(req, res, nextSpy);
    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

