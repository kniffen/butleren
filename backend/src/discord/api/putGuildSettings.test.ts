import type { Request, Response } from 'express';
import { putGuildSettings } from './putGuildSettings';
import { client } from '../client';
import { database } from '../../database/database';

jest.mock('../client', () => ({
  client: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

describe('putGuildSettings()', () => {
  const guildFetchMock = jest.spyOn(client.guilds, 'fetch');

  beforeEach(async () => {
    const db = await database;
    await db.run(
      'INSERT INTO guilds (guildId, settings) VALUES (?, ?)',
      guildId,
      JSON.stringify({ color: 'red', timezone: 'UTC' })
    );
  });

  test('It should update guild settings', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 'blue', timezone: 'PST' },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    guildFetchMock.mockResolvedValue({ id: guildId });

    await putGuildSettings(request as unknown as Request, response);

    const db = await database;
    const dbContent = await db.get<{settings: string}>('SELECT * FROM guilds WHERE guildId = ?', guildId);
    expect(dbContent).toEqual({ guildId, settings: JSON.stringify(request.body) });
    expect(response.sendStatus).toHaveBeenCalledWith(204);
  });

  test('It should respond with 400 if the request body is invalid', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 'blue' },
    } as unknown as Request;

    await putGuildSettings(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.send).toHaveBeenCalledWith('Invalid request body');
  });

  test('It should respond with 404 if the guild is not found', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 'blue', timezone: 'PST' },
    } as unknown as Request;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    guildFetchMock.mockResolvedValue(null);

    await putGuildSettings(request, response);

    expect(response.sendStatus).toHaveBeenCalledWith(404);
  });

  test('It should respond with 500 if an error occurs while updating the guild settings', async () => {
    const request = {
      params: { 'guild': guildId },
      body:   { color: 'blue', timezone: 'PST' },
    } as unknown as Request;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    guildFetchMock.mockResolvedValue({ id: guildId });

    const db = await database;
    jest.spyOn(db, 'run').mockRejectedValue(new Error('Test error'));

    await putGuildSettings(request, response);

    expect(response.sendStatus).toHaveBeenCalledWith(500);
  });
});

const guildId = '12345';

const response = {
  status:     jest.fn(() => response),
  send:       jest.fn(),
  sendStatus: jest.fn(),
} as unknown as Response;