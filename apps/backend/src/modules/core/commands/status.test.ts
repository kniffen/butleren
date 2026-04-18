import type { ChatInputCommandInteraction } from 'discord.js';
import { statusCommand } from './status';
import { getGuildAccentColor } from '../../../utils/getGuildAccentColor';

jest.mock('node:os', () => ({
  uptime: (): number => 10_000
}));

jest.mock('node:process', () => ({
  uptime:      (): number  => 20_000,
  memoryUsage: (): unknown => ({ heapUsed: 2_000_000_000 })
}));

jest.mock('../../../utils/getGuildAccentColor', () => ({
  getGuildAccentColor: jest.fn(async () => '#FF0000')
}));

describe('status command', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(100_000);
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('it should be locked', () => {
    expect(statusCommand.isLocked).toBe(true);
  });

  test('it should have a slash command builder', () => {
    expect(statusCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'status',
      description: 'Status check'
    }));
  });

  describe('execute', () => {
    test('it should reply with an embed', async () => {
      const reply = jest.fn();
      const commandInteraction = { reply, guild: 'guild-12345' } as unknown as ChatInputCommandInteraction;
      await statusCommand.execute(commandInteraction);

      expect(getGuildAccentColor).toHaveBeenCalledWith('guild-12345');
      expect(reply).toHaveBeenCalledWith({
        embeds: [{
          data: {
            title:  'Status',
            color:  16711680,
            fields: [
              { name: 'System time',   value: '1970-01-01T00:01:40.000Z' },
              { name: 'System uptime', value: '0d 02:46:40' },
              { name: 'Bot uptime',    value: '0d 05:33:20' },
              { name: 'Memory usage',  value: '1,907 MB'  },
            ]
          }
        }]
      });
    });
  });
});