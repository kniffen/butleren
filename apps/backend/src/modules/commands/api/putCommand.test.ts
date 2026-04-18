import type { Request, Response } from 'express';
import { putCommand } from './putCommand';
import { discordClient } from '../../../discord/client';
import type { Guild } from 'discord.js';
import * as enableCommand from '../utils/enableCommand';
import * as disableCommand from '../utils/disableCommand';

jest.mock('../../../discord/client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

jest.mock('../../modules', () => ({
  commands: new Map([
    ['foo', { isLocked: false, slashCommandBuilder: { name: 'foo', } }],
    ['bar', { isLocked: false, slashCommandBuilder: { name: 'bar', } }],
    ['baz', { isLocked: true,  slashCommandBuilder: { name: 'baz', } }],
  ]),
}));

describe('putCommand()', () => {
  const fetchGuildMock = jest.spyOn(discordClient.guilds, 'fetch');
  const req = { path: '/foo/bar' } as unknown as Request;
  const res = { status: jest.fn(() => res), sendStatus: jest.fn(), json: jest.fn() } as unknown as Response;
  const nextSpy = jest.fn();
  const enableCommandSpy = jest.spyOn(enableCommand, 'enableCommand').mockImplementation();
  const disableCommandSpy = jest.spyOn(disableCommand, 'disableCommand').mockImplementation();

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

  test('It should enable a command in a guild', async () => {
    req.params.slug = 'foo';
    req.body = { isEnabled: true };
    await putCommand(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(enableCommandSpy).toHaveBeenCalledWith({ isLocked: false, slashCommandBuilder: { name: 'foo' } }, guild);
    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should disable a command in a guild', async () => {
    req.params.slug = 'bar';
    req.body = { isEnabled: false };
    await putCommand(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(enableCommandSpy).not.toHaveBeenCalled();
    expect(disableCommandSpy).toHaveBeenCalledWith({ isLocked: false, slashCommandBuilder: { name: 'bar' } }, guild);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should respond with 404 if the command does not exist', async () => {
    req.params.slug = 'nonexistent';
    req.body = { isEnabled: true };
    await putCommand(req, res, nextSpy);

    expect(fetchGuildMock).not.toHaveBeenCalled();
    expect(enableCommandSpy).not.toHaveBeenCalled();
    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with 403 if the command is locked', async () => {
    req.params.slug = 'baz';
    req.body = { isEnabled: true };
    await putCommand(req, res, nextSpy);

    expect(fetchGuildMock).not.toHaveBeenCalled();
    expect(enableCommandSpy).not.toHaveBeenCalled();
    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('It should respond with 400 if the request body is invalid', async () => {
    req.params.slug = 'foo';
    req.body = { invalidField: true };
    await putCommand(req, res, nextSpy);

    expect(enableCommandSpy).not.toHaveBeenCalled();
    expect(disableCommandSpy).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(400);
  });


  test('It pass the error to the next function if it occurs while fetching modules', async () => {
    const error = new Error('Test error');
    fetchGuildMock.mockRejectedValueOnce(error);

    req.params.slug = 'foo';
    req.body = { isEnabled: true };
    await putCommand(req, res, nextSpy);

    expect(fetchGuildMock).toHaveBeenCalledWith('12345');
    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guild = {
  id:   '12345',
  name: 'Test Guild',
} as unknown as Guild;