import { Collection, type Client } from 'discord.js';
import * as logger from '../../logger/logger';
import * as updateGuildCommands from '../utils/updateGuildCommands';
import { onReady } from './onReady';

describe('Discord: onReady', () => {
  const updateGuildCommandsSpy = jest.spyOn(updateGuildCommands, 'updateGuildCommands').mockImplementation();

  afterAll(() => {
    updateGuildCommandsSpy.mockRestore();
  });

  test('It should update the guild commands for each guild', async () => {
    await onReady(client);
    expect(client.user?.setActivity).toHaveBeenCalled();
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Logged in as "bot"');
    expect(updateGuildCommandsSpy).toHaveBeenCalledTimes(2);
    expect(updateGuildCommandsSpy).toHaveBeenNthCalledWith(1, { id: '1' });
    expect(updateGuildCommandsSpy).toHaveBeenNthCalledWith(2, { id: '2' });
  });

  test('It should catch errors and log them', async () => {
    const error = new Error('Test error');
    updateGuildCommandsSpy.mockRejectedValueOnce(error);

    await onReady(client);
    expect(logger.logError).toHaveBeenCalledWith('Discord', 'Error during onReady event', error);
  });
});

const guilds = new Collection([
  ['1', { id: '1' }],
  ['2', { id: '2' }],
]);

const client = {
  guilds: {
    fetch: jest.fn(async (id?: string) => id ? guilds.get(id) : guilds),
    cache: guilds,
  },
  user: {
    tag:         'bot',
    setActivity: jest.fn(),
  },
} as unknown as Client;

