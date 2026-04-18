import type { Request, Response } from 'express';
import type { Guild } from 'discord.js';
import { postRestoreCommand } from './postRestoreCommand';
import { discordClient } from '../../../discord/client';
import * as insertOrReplaceDBEntry from '../../../database/utils/insertOrReplaceDBEntry';
import * as removeApplicationCommand from '../utils/removeApplicationCommand';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

jest.mock('../../modules', () => ({
  commands: new Map([
    ['foo', {
      slashCommandBuilder: { name: 'foo' },
      defaultSettings:     { isEnabled: true },
      isLocked:            false
    }],
    ['bar', {
      slashCommandBuilder: { name: 'bar' },
      defaultSettings:     { isEnabled: false },
      isLocked:            false
    }],
    ['baz', {
      slashCommandBuilder: { name: 'baz' },
      defaultSettings:     { isEnabled: true },
      isLocked:            true
    }],
  ]),
}));

describe('postRestoreCommand()', () => {
  const fetchGuildMock = jest.spyOn(discordClient.guilds, 'fetch');
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockImplementation();
  const removeApplicationCommandSpy = jest.spyOn(removeApplicationCommand, 'removeApplicationCommand').mockImplementation();
  const req = { path: '/api/guild/12345/command/foo/restore' } as unknown as Request;
  const res = { status: jest.fn(() => res), sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req.params = { guild: '12345' };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should restore a command to its original state', async () => {
    req.params.slug = 'foo';
    await postRestoreCommand(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(removeApplicationCommandSpy).toHaveBeenCalledWith('foo', guild);
    expect(createCommandSpy).toHaveBeenCalledWith({ name: 'foo' });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', {
      slug:      'foo',
      guildId:   guild.id,
      isEnabled: 1
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should not recreate commands that re off by default', async () => {
    req.params.slug = 'bar';
    await postRestoreCommand(req, res, nextSpy);

    expect(removeApplicationCommandSpy).toHaveBeenCalledWith('bar', guild);
    expect(createCommandSpy).not.toHaveBeenCalledWith();
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('commands', {
      slug:      'bar',
      guildId:   guild.id,
      isEnabled: 0
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should respond with 404 if the command does not exist', async () => {
    req.params.slug = 'nonexistent';
    await postRestoreCommand(req, res, nextSpy);

    expect(fetchGuildMock).not.toHaveBeenCalled();
    expect(removeApplicationCommandSpy).not.toHaveBeenCalled();
    expect(createCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(404);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should respond with 403 is the command is locked', async () => {
    req.params.slug = 'baz';
    await postRestoreCommand(req, res, nextSpy);

    expect(fetchGuildMock).not.toHaveBeenCalled();
    expect(removeApplicationCommandSpy).not.toHaveBeenCalled();
    expect(createCommandSpy).not.toHaveBeenCalled();
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  test('It should pass the error to the next function if it occurs', async () => {
    const error = new Error('Test error');
    fetchGuildMock.mockRejectedValueOnce(error);

    req.params.slug = 'foo';
    await postRestoreCommand(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(nextSpy).toHaveBeenCalledWith(error);
    expect(res.sendStatus).not.toHaveBeenCalled();
  });
});

const createCommandSpy = jest.fn();
const guild = {
  id:       '12345',
  commands: { create: createCommandSpy },
} as unknown as Guild;