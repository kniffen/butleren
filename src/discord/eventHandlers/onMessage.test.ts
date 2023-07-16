import { ChannelType, Message } from 'discord.js';

import database from '../../database';
import { modules as modulesMock } from '../../modules';
import onMessage from './onMessage';

jest.mock('../../modules', () => {
  const { ChannelType } = jest.requireActual('discord.js');

  return {
    modules: [
      {
        id: 'static_module',
        allowedChannelTypes: [ChannelType.GuildText],
        onMessage: jest.fn(),
        isLocked: true,
      },
      {
        id: 'disabled_module',
        onMessage: jest.fn(),
        allowedChannelTypes: [ChannelType.GuildText, ChannelType.DM],
        isLocked: false,
      },
      {
        id: 'enabled_module',
        onMessage: jest.fn(),
        allowedChannelTypes: [ChannelType.GuildText, ChannelType.DM],
        isLocked: false,
      }
    ]
  };
});

describe('discord.eventHandlers.onMessage()', function () {
  let db: Awaited<typeof database>;

  const staticModule   = modulesMock[0];
  const disabledModule = modulesMock[1];
  const enabledModule  = modulesMock[2];

  beforeAll(async function () {
    db = await database;

    await db.migrate();

    await Promise.all([
      db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001']),
      db.run('INSERT INTO modules (id, guildId) VALUES (?,?)', ['disabled_module', 'guild001']),
      db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['enabled_module', 'guild001', 1]),
    ]);
  });

  afterEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
    db.close();
  });

  it('should ignore messages from bots', async function () {
    const message = {
      author: { bot: true },
      channel: { type: ChannelType.GuildText }
    } as Message;

    await onMessage(message);

    expect(staticModule.onMessage).not.toHaveBeenCalled();
    expect(disabledModule.onMessage).not.toHaveBeenCalled();
    expect(enabledModule.onMessage).not.toHaveBeenCalled();
  });

  it('should ignore direct messages', async function () {
    const message = {
      author: { bot: false },
      channel: { type: ChannelType.DM },
      cleanContent: 'enabled_module_enabled_command bar baz'
    } as Message;

    await onMessage(message);

    expect(staticModule.onMessage).not.toHaveBeenCalled();
    expect(disabledModule.onMessage).not.toHaveBeenCalled();
    expect(enabledModule.onMessage).not.toHaveBeenCalled();
  });

  it('should pass messages to enabled and static modules', async function () {
    const message = {
      author: { bot: false },
      channel: {
        type: ChannelType.GuildText,
        guild: { id: 'guild001' }
      },
      cleanContent: 'foo bar baz'
    } as Message;

    await onMessage(message);

    expect(staticModule.onMessage).toHaveBeenCalledWith(message);
    expect(disabledModule.onMessage).not.toHaveBeenCalled();
    expect(enabledModule.onMessage).toHaveBeenCalledWith(message);
  });

  it('should handle the guild not existing in the database', async function () {
    const message = {
      author: { bot: false },
      channel: {
        type: ChannelType.GuildText,
        guild: { id: 'guild999' }
      },
      cleanContent: 'foo bar baz'
    } as Message;

    await onMessage(message);

    expect(staticModule.onMessage).not.toHaveBeenCalled();
    expect(disabledModule.onMessage).not.toHaveBeenCalled();
    expect(enabledModule.onMessage).not.toHaveBeenCalled();
  });
});