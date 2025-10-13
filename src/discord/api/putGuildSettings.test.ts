import type { Request, Response } from 'express';
import { putGuildSettings } from './putGuildSettings';
import { discordClient } from '../client';
import * as setGuildSettings from '../database/setGuildSettings';

jest.mock('../client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

describe('putGuildSettings()', () => {
  const setGuildSettingsMock = jest.spyOn(setGuildSettings, 'setGuildSettings').mockImplementation();
  const guildFetchMock = jest.spyOn(discordClient.guilds, 'fetch');
  const nextSpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should update guild settings', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 'blue' },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    guildFetchMock.mockResolvedValue({ id: guildId });

    await putGuildSettings(request as unknown as Request, response, nextSpy);

    expect(setGuildSettingsMock).toHaveBeenCalledWith(expect.objectContaining({ id: guildId }), request.body);
    expect(response.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should respond with 400 if the request body is missing', async () => {
    const request = {
      params: { 'guild': guildId },
    } as unknown as Request;

    await putGuildSettings(request, response, nextSpy);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith('Missing request body');
  });

  test('It should respond with 400 if the request body is invalid', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 55 },
    } as unknown as Request;

    await putGuildSettings(request, response, nextSpy);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith('Invalid request body');
  });

  test('It pass the error to the next function if an error occurs while updating the guild settings', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 'blue' },
    } as unknown as Request;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    guildFetchMock.mockResolvedValue({ id: guildId });

    const error = new Error('Test error');
    setGuildSettingsMock.mockRejectedValueOnce(error);

    await putGuildSettings(request, response, nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(error);
  });
});

const guildId = '12345';

const response = {
  status:     jest.fn(() => response),
  send:       jest.fn(),
  sendStatus: jest.fn(),
} as unknown as Response;