import { Collection, type Client } from 'discord.js';
import * as logger from '../../modules/logs/logger';
import * as updateApplicationCommands from '../utils/updateApplicationCommands';
import * as updateGuildCommands from '../utils/updateGuildCommands';
import { onReady } from './onReady';

describe('Discord: onReady', () => {
  const updateApplicationCommandsSpy = jest.spyOn(updateApplicationCommands, 'updateApplicationCommands').mockImplementation();
  const updateGuildCommandsSpy = jest.spyOn(updateGuildCommands, 'updateGuildCommands').mockImplementation();

  afterAll(() => {
    updateGuildCommandsSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should update commands for the application', async () => {
    await onReady(discordClient);

    expect(updateApplicationCommandsSpy).toHaveBeenCalledWith(discordClient.application);
  });

  test('It should update commands for each guild', async () => {
    await onReady(discordClient);

    expect(discordClient.user?.setActivity).toHaveBeenCalledWith('1.0.2');
    expect(logger.logInfo).toHaveBeenCalledWith('Discord', 'Logged in as "bot"');
    expect(updateGuildCommandsSpy).toHaveBeenCalledTimes(2);
    expect(updateGuildCommandsSpy).toHaveBeenNthCalledWith(1, { id: '1' });
    expect(updateGuildCommandsSpy).toHaveBeenNthCalledWith(2, { id: '2' });
  });

  test('It should catch errors and log them', async () => {
    const error = new Error('Test error');
    updateGuildCommandsSpy.mockRejectedValueOnce(error);

    await onReady(discordClient);
    expect(logger.logError).toHaveBeenCalledWith('Discord', 'Error during onReady event', error);
  });
});

const guilds = new Collection([
  ['1', { id: '1' }],
  ['2', { id: '2' }],
]);

const discordClient = {
  application: 'application',
  guilds:      {
    fetch: jest.fn(async (id?: string) => id ? guilds.get(id) : guilds),
    cache: guilds,
  },
  user: {
    tag:         'bot',
    setActivity: jest.fn(),
  },
} as unknown as Client;

