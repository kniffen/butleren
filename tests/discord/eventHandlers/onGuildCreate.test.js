import addGuildToDatabaseMock from '../../../database/addGuildToDatabase.js'
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

jest.mock('../../../database/addGuildToDatabase.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue()
}))

describe('discord.eventHandlers.onGuildCreate()', function() {
  const guild = {
    id: 'guild001',
    commands: {create: jest.fn()}
  }

  beforeAll(async function() {
    jest.clearAllMocks()

    await onGuildCreate(guild)
  })

  afterAll(function() {
    jest.unmock('../../../modules/index.js')
  })

  it('should add guilds to the database', function() {
    expect(addGuildToDatabaseMock).toHaveBeenCalledWith(guild)
  })

  it('should create guild commands', function() {
    expect(guild.commands.create).toHaveBeenCalledTimes(2)
    expect(guild.commands.create).toHaveBeenNthCalledWith(1, 'command001data')
    expect(guild.commands.create).toHaveBeenNthCalledWith(2, 'command002data')
  })

  it('should handle command creation being rejected', async function() {
    guild.commands.create.mockRejectedValue('Error message')
    
    await onGuildCreate(guild)

    expect(console.error).toHaveBeenCalledWith('Error message')
  })
})