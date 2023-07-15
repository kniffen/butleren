import { Client, Collection, Guild } from 'discord.js';

import addGuildToDatabaseMock from '../../database/addGuildToDatabase';
import onReady from './onReady';

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
  default: jest.fn().mockResolvedValue(undefined)
}));

describe('discord.eventHandlers.onReady()', function () {
  const guilds           = new Collection<string, Guild>();
  const guildCommands001 = new Collection();
  const guildCommands002 = new Collection();

  const client = {
    user: {
      setActivity: jest.fn()
    },
    guilds: {
      fetch: jest.fn().mockImplementation(async (id) => id ? guilds.get(id) : guilds)
    }
  } as unknown as Client;

  guilds.set('guild001', {
    id: 'guild001',
    commands: {
      fetch:  jest.fn().mockResolvedValue(guildCommands001),
      create: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      edit:   jest.fn().mockResolvedValue(undefined),
    }
  } as unknown as Guild);

  guilds.set('guild002', {
    id: 'guild002',
    commands: {
      fetch:  jest.fn().mockResolvedValue(guildCommands002),
      create: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      edit:   jest.fn().mockResolvedValue(undefined),
    }
  } as unknown as Guild);

  guildCommands001.set('guildcmd001', { name: 'command001' });
  guildCommands001.set('guildcmd999', { name: 'command999' });
  guildCommands002.set('guildcmd002', { name: 'command002' });

  beforeAll(async function () {
    (console.log as jest.MockedFunction<typeof console.log>)
      .mockImplementation(() => undefined);

    await onReady(client);
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('should log successful connections', function () {
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Discord: Client is ready.');
  });

  it('should set the activity status of the bot', function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(client.user.setActivity).toHaveBeenCalledWith(process.env.npm_package_version);
  });

  it('should add guilds to the database', function () {
    expect(addGuildToDatabaseMock).toHaveBeenCalledWith(guilds.get('guild001'));
    expect(addGuildToDatabaseMock).toHaveBeenCalledWith(guilds.get('guild002'));
  });

  it('should edit commands in case they were updated', function () {
    const guild001Edit = guilds.get('guild001')?.commands.edit;
    const guild002Edit = guilds.get('guild002')?.commands.edit;

    expect(guild001Edit).toHaveBeenCalledTimes(1);
    expect(guild001Edit).toHaveBeenCalledWith({ name: 'command001' }, 'command001data');

    expect(guild002Edit).toHaveBeenCalledTimes(1);
    expect(guild002Edit).toHaveBeenCalledWith({ name: 'command002' }, 'command002data');
  });

  it('should create new locked commands if they don\'t exist for the guild', function () {
    const guild001Create = guilds.get('guild001')?.commands.create;
    const guild002Create = guilds.get('guild002')?.commands.create;

    expect(guild001Create).toHaveBeenCalledTimes(1);
    expect(guild001Create).toHaveBeenCalledWith('command002data');

    expect(guild002Create).not.toHaveBeenCalled();
  });

  it('should delete commands that don\'t exist', function () {
    const guild001Delete = guilds.get('guild001')?.commands.delete;
    const guild002Delete = guilds.get('guild002')?.commands.delete;

    expect(guild001Delete).toHaveBeenCalledTimes(1);
    expect(guild001Delete).toHaveBeenCalledWith({ name: 'command999' });

    expect(guild002Delete).not.toHaveBeenCalled();
  });

  it('should handle command edit, create and delete being rejected', async function () {
    const guild001 = guilds.get('guild001');

    (guild001?.commands.create as jest.Mock).mockRejectedValue('Guild001 commands create error');
    (guild001?.commands.edit as jest.Mock).mockRejectedValue('Guild001 commands edit error');
    (guild001?.commands.delete as jest.Mock).mockRejectedValue('Guild001 commands delete error');

    await onReady(client);
    await new Promise((r) => setTimeout(r, 100)); // Not ideal, but it works

    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenNthCalledWith(1, 'Guild001 commands edit error');
    expect(console.error).toHaveBeenNthCalledWith(2, 'Guild001 commands create error');
    expect(console.error).toHaveBeenNthCalledWith(3, 'Guild001 commands delete error');
  });

  it('should handle guilds fetch being rejected', async function () {
    (client.guilds.fetch as jest.Mock).mockRejectedValue('Guilds fetch error');

    await onReady(client);
  });

  it.todo('should handle guild commands fetch being rejected');
});