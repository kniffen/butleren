import database from '../../../database/index.js'
import onGuildCreate from '../../../discord/eventHandlers/onGuildCreate.js'

jest.mock('../../../modules/index.js', () => {
  const module001 = {
    commands: {
      cmd001: {
        isLocked: false,
        data: {
          name: 'command001',
          toJSON: () => 'command001data'
        }
      },
      cmd002: {
        isLocked: true,
        data: {
          name: 'command002',
          toJSON: () => 'command002data'
        }
      }
    }
  }
  
  return {
    __esModule: true,
    module001,
  }
})

describe('discord.eventHandlers.onGuildCreate()', function() {
  let db = null

  const guild = {
    id: 'guild001',
    commands: {create: jest.fn()}
  }

  beforeAll(async function() {
    jest.clearAllMocks()

    db = await database

    await db.migrate()

    // Running twice to ensure the guild only gets added once
    await onGuildCreate(guild)
    await onGuildCreate(guild)
  })

  afterAll(function() {
    jest.unmock('../../../modules/index.js')
    db.close()
  })

  it('should add guild settings to the database', async function() {
    expect(await db.all('SELECT * from guilds')).toEqual([{
      id: 'guild001',
      nickname: null,
      color: '#19D8B4',
      timezone: 'UTC',
    }])
  })

  it('should add modules to the database', async function() {
    const entries = await db.all('SELECT * from modules')
    entries.sort((a, b) => a.id.localeCompare(b.id))
    
    expect(entries).toEqual([])
  })

  it('should create guild commands', async function() {
    expect(guild.commands.create).toHaveBeenCalledTimes(4)
    expect(guild.commands.create).toHaveBeenNthCalledWith(1, 'command001data')
    expect(guild.commands.create).toHaveBeenNthCalledWith(2, 'command002data')
  })

  it('should handle updating the database being rejected', async function() {
    jest.spyOn(db, 'run').mockRejectedValue('SQL error')
    await onGuildCreate(guild)

    expect(console.error).toHaveBeenCalledTimes(3)
    expect(console.error).toHaveBeenNthCalledWith(1, 'SQL error')
    expect(console.error).toHaveBeenNthCalledWith(2, 'SQL error')
    expect(console.error).toHaveBeenNthCalledWith(3, 'SQL error')

    db.run.mockRestore()
  })

  it.todo('should handle command creation being rejected')
})