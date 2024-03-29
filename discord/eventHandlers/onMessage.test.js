import { ChannelType } from 'discord.js'

import database from '../../database/index.js'
import * as modulesMock from '../../modules/index.js'
import onMessage from './onMessage.js'

jest.mock('../../modules/index.js', () => {
  const { ChannelType } = require('discord.js')
  
  return {
    __esModule: true,
    staticModule: {
      id: 'static_module',
      allowedChannelTypes: [ChannelType.GuildText],
      onMessage: jest.fn(),
    },
    disabledModule: {
      id: 'disabled_module',
      onMessage: jest.fn(),
      allowedChannelTypes: [ChannelType.GuildText, ChannelType.DM]
    },
    enabledModule: {
      id: 'enabled_module',
      onMessage: jest.fn(),
      allowedChannelTypes: [ChannelType.GuildText, ChannelType.DM]
    }
  }
})

describe('discord.eventHandlers.onMessage()', function() {
  let db = null

  beforeAll(async function() {
    db = await database

    await db.migrate()

    await Promise.all([
      db.run('INSERT INTO guilds (id) VALUES (?)', ['guild001']),
      db.run('INSERT INTO modules (id, guildId) VALUES (?,?)', ['disabled_module', 'guild001']),
      db.run('INSERT INTO modules (id, guildId, isEnabled) VALUES (?,?,?)', ['enabled_module', 'guild001', 1]),
    ])
  })

  afterEach(function() {
    jest.clearAllMocks()
  })

  afterAll(function() {
    jest.restoreAllMocks()
    db.close()
  })

  it('should ignore messages from bots', async function() {
    const message = {
      author: {bot: true},
      channel: {type: ChannelType.GuildText}
    }

    await onMessage(message)

    expect(modulesMock.staticModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.disabledModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.enabledModule.onMessage).not.toHaveBeenCalled()
  })

  it('should ignore direct messages', async function() {
    const message = {
      author: {bot: false},
      channel: {type: ChannelType.DM},
      cleanContent: 'enabled_module_enabled_command bar baz'
    }

    await onMessage(message)

    expect(modulesMock.staticModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.disabledModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.enabledModule.onMessage).not.toHaveBeenCalled()
  })
   
  it('should pass messages to enabled and static modules', async function() {
    const message = {
      author: {bot: false},
      channel: {
        type: ChannelType.GuildText,
        guild: {id: 'guild001'}
      },
      cleanContent: 'foo bar baz'
    }

    await onMessage(message)

    expect(modulesMock.disabledModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.enabledModule.onMessage).toHaveBeenCalledWith(message)
    expect(modulesMock.staticModule.onMessage).toHaveBeenCalledWith(message)
  })

  it('should handle the guild not existing in the database', async function() {
    const message = {
      author: {bot: false},
      channel: {
        type: ChannelType.GuildText,
        guild: {id: 'guild999'}
      },
      cleanContent: 'foo bar baz'
    }

    await onMessage(message)

    expect(modulesMock.disabledModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.enabledModule.onMessage).not.toHaveBeenCalled()
    expect(modulesMock.staticModule.onMessage).not.toHaveBeenCalled()
  })
})