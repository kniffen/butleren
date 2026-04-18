import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import { putModuleSettings } from './putModuleSettings';
import { discordClient } from '../../../discord/client';
import * as disableCommand from '../../commands/utils/disableCommand';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';

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
      'foo',
      {
        slug:        'foo',
        name:        'Foo',
        description: 'A test module',
        isLocked:    false,
        commands:    new Map([
          ['foo', { name: 'foo', description: 'Foo command', slashCommandBuilder: {} }],
        ]),
      }
    ],
    [
      'bar',
      {
        slug:        'bar',
        name:        'Bar',
        description: 'Another test module',
        isLocked:    true,
      }
    ]
  ]),
}));

describe('putModuleSettings()', () => {
  const disableCommandSpy = jest.spyOn(disableCommand, 'disableCommand').mockImplementation();
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockImplementation();

  const fetchGuildMock = jest.spyOn(discordClient.guilds, 'fetch');
  const req = { path: '/foo/bar' } as unknown as Request;
  const res = { sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    req.params = {};
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should send a PUT request for enabling a module', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foo';
    req.body           = { isEnabled: true };

    await putModuleSettings(req, res, nextSpy);

    expect(discordClient.guilds.fetch).toHaveBeenCalledWith('12345');
    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', {
      slug:      'foo',
      guildId:   guild.id,
      isEnabled: 1
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should send a PUT request for disabling a module', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foo';
    req.body           = { isEnabled: false };
    await putModuleSettings(req, res, nextSpy);

    expect(disableCommandSpy).toHaveBeenCalledWith(
      { name: 'foo', description: 'Foo command', slashCommandBuilder: {} },
      guild,
    );
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('modules', {
      slug:      'foo',
      guildId:   guild.id,
      isEnabled: 0
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should respond with 404 if the module is not found', async () => {
    req.params['slug']  = 'nonexistent-module';
    await putModuleSettings(req, res, nextSpy);

    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with 404 if the guild is not found', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(null);

    req.params['guild'] = 'nonexistent-guild';
    await putModuleSettings(req, res, nextSpy);

    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with a 403 if the module is locked', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'bar';
    req.body           = { isEnabled: false };

    await putModuleSettings(req, res, nextSpy);


    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('It should respond with a 400 if the request body is invalid', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foo';
    req.body           = { };

    await putModuleSettings(req, res, nextSpy);

    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockRejectedValue(error);

    req.params['guild'] = '12345';
    req.params['slug']  = 'foo';
    await putModuleSettings(req, res, nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guild = {
  name: 'Guild Name',
} as unknown as Guild;