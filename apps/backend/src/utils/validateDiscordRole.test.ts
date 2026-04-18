import type { Guild } from 'discord.js';
import type { Response } from 'express';
import { validateDiscordRole } from './validateDiscordRole';

describe('validateDiscordRole()', () => {
  test('It should do nothing if no role id is provided', async () => {
    await expect(validateDiscordRole(undefined, guild, res)).resolves.toEqual(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('It should do nothing if the role id is null', async () => {
    await expect(validateDiscordRole(null, guild, res)).resolves.toEqual(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('It should do nothing if no role exists', async () => {
    roleFetchMock.mockResolvedValueOnce({ id: 'role-id-1' } as unknown as Guild);

    await expect(validateDiscordRole('role-id-1', guild, res)).resolves.toEqual(true);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('It should respond with 400 if the role does not exist', async () => {
    roleFetchMock.mockResolvedValueOnce(null);

    await expect(validateDiscordRole('invalid-role-id', guild, res)).resolves.toEqual(false);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Discord role with id "invalid-role-id" not found' });
  });
});

const roleFetchMock = jest.fn();
const guild = {
  roles: {
    fetch: roleFetchMock
  }
} as unknown as Guild;

const res = {
  status: jest.fn(() => res),
  json:   jest.fn(),
} as unknown as Response;