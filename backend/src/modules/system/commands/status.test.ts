import type { CommandInteraction } from 'discord.js';
import { statusCommand } from './status';

jest.mock('node:os', () => ({
  uptime: (): number => 10_000
}));

jest.mock('node:process', () => ({
  uptime:      (): number  => 20_000,
  memoryUsage: (): unknown => ({ heapUsed: 2_000_000_000 })
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
      const commandInteraction = { reply } as unknown as CommandInteraction;
      await statusCommand.execute(commandInteraction);
      expect(reply).toHaveBeenCalledWith({
        embeds: [{
          data: {
            title:  'Status',
            color:  1693876,
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