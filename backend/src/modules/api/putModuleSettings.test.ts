import type { Request, Response } from 'express';
import { Collection, type Guild } from 'discord.js';
import { putModuleSettings } from './putModuleSettings';
import { client } from '../../discord/client';
import { database } from '../../database/database';

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
        commands:    new Map([
          ['foo', { name: 'foo', description: 'Foo command', slashCommandBuilder: {} }],
        ]),
      },
    ],
  ]),
}));

describe('putModuleSettings()', () => {
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
      JSON.stringify({ isEnabled: false })
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should send a PUT request for enabling a module', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foobar';
    req.body           = { isEnabled: true };

    const db = await database;
    await putModuleSettings(req, res);

    expect(client.guilds.fetch).toHaveBeenCalledWith('12345');
    expect(guild.commands.fetch).not.toHaveBeenCalled();
    expect(guild.commands.create).toHaveBeenCalledTimes(1);
    expect(guild.commands.create).toHaveBeenCalledWith({});
    expect(guild.commands.delete).not.toHaveBeenCalled();
    const storedSettings = await db.get('SELECT settings FROM modules WHERE guildId = ? AND slug = ?', '12345', 'foobar');
    expect(storedSettings).toEqual({ settings: JSON.stringify({ isEnabled: true }) });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should send a PUT request for disabling a module', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foobar';
    req.body           = { isEnabled: false };

    const applicationCommands = new Collection([
      ['foo', { name: 'foo' }],
    ]);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    guild.commands.fetch.mockResolvedValueOnce(applicationCommands);

    const db = await database;
    await putModuleSettings(req, res);

    expect(guild.commands.fetch).toHaveBeenCalledTimes(1);
    expect(guild.commands.create).not.toHaveBeenCalled();
    expect(guild.commands.delete).toHaveBeenCalledTimes(1);
    expect(guild.commands.delete).toHaveBeenCalledWith({ name: 'foo' });
    const storedSettings = await db.get('SELECT settings FROM modules WHERE guildId = ? AND slug = ?', '12345', 'foobar');
    expect(storedSettings).toEqual({ settings: JSON.stringify({ isEnabled: false }) });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should respond with 404 if the module is not found', async () => {
    req.params['slug']  = 'nonexistent-module';
    await putModuleSettings(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with 404 if the guild is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(null);

    req.params['guild'] = 'nonexistent-guild';
    await putModuleSettings(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with a 400 if the request body is invalid', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foobar';
    req.body           = { };

    await putModuleSettings(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  test('It should respond with a 500 if an error occurs', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockRejectedValue(new Error('Test error'));

    req.params['guild'] = '12345';
    req.params['slug']  = 'foobar';
    await putModuleSettings(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});

const guild = {
  name:     'Guild Name',
  commands: {
    fetch:  jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  }
} as unknown as Guild;