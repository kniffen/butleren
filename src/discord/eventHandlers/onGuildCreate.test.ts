import { Guild } from 'discord.js';
import addGuildToDatabaseMock from '../../database/addGuildToDatabase';
import onGuildCreate from './onGuildCreate';

jest.mock('../../modules', () => {
  const module001 = {
    commands: [
      {
        isLocked: false,
        data: {
          name: 'command001',
          toJSON: () => 'command001data'
        }
      },
      {
        isLocked: true,
        data: {
          name: 'command002',
          toJSON: () => 'command002data'
        }
      }
    ]
  };

  return [
    module001,
  ];
});

jest.mock('../../database/addGuildToDatabase', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(async () => undefined)
}));

describe('discord.eventHandlers.onGuildCreate()', function () {
  const guild = {
    id: 'guild001',
    commands: { create: jest.fn() }
  } as unknown as Guild;

  beforeAll(async function () {
    jest.clearAllMocks();

    await onGuildCreate(guild);
  });

  afterAll(function () {
    jest.unmock('../../modules');
  });

  it('should add guilds to the database', function () {
    expect(addGuildToDatabaseMock).toHaveBeenCalledWith(guild);
  });

  it('should create guild commands', function () {
    expect(guild.commands.create).toHaveBeenCalledTimes(2);
    expect(guild.commands.create).toHaveBeenNthCalledWith(1, 'command001data');
    expect(guild.commands.create).toHaveBeenNthCalledWith(2, 'command002data');
  });

  it('should handle command creation being rejected', async function () {
    const createMock = guild.commands.create as jest.MockedFunction<typeof guild.commands.create>;
    createMock.mockRejectedValue('Error message');

    await onGuildCreate(guild);

    expect(console.error).toHaveBeenCalledWith('Error message');
  });
});