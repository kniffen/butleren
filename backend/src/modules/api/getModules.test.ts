import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import { getModules } from './getModules';
import { database } from '../../database/database';
import { client } from '../../discord/client';

jest.mock('../../discord/client', () => ({
  client: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

jest.mock('../modules', () => ({
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
  const fetchGuildMock = jest.spyOn(client.guilds, 'fetch');
  const req = { path: '/foo/bar' } as unknown as Request;
  const res = { sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;

  beforeEach(async () => {
    jest.clearAllMocks();
    req.params = {};

    const db = await database;
    await db.run(
      'INSERT INTO modules (guildId, slug, settings) VALUES (?, ?, ?)',
      '12345',
      'foobar',
      JSON.stringify({ foo: 'bar' })
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get all modules and their settings', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue({} as unknown as Guild);

    req.params['guild'] = '12345';
    await getModules(req, res);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{
      slug:        'foobar' ,
      name:        'Foo Bar',
      description: 'A test module',
      isLocked:    false,
      settings:    { 'foo': 'bar' },
    }]);
  });

  test('It should respond with 404 not found if the guild is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(null);

    req.params['guild'] = '12345';
    await getModules(req, res);
    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(res.json).not.toHaveBeenCalled();
  });

  test('It should respond with 500 if an error occurs while fetching modules', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockRejectedValue(new Error('Test error'));

    req.params['guild'] = '12345';
    await getModules(req, res);
    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(res.json).not.toHaveBeenCalled();
  });
});

