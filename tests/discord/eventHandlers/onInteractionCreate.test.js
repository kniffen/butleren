import onInteractionCreate from '../../../discord/eventHandlers/onInteractionCreate.js'

import * as modulesMock from '../../../modules/index.js'

jest.mock('../../../modules/index.js', () => {
  return {
    __esModule: true,
    module001: {
      commands: {
        cmd001: {data: {name: 'command001'}, execute: jest.fn().mockResolvedValue()},
        cmd002: {data: {name: 'command002'}, execute: jest.fn().mockResolvedValue()},
      }
    },
    module002: {
      commands: {
        cmd003: {data: {name: 'command003'}, execute: jest.fn().mockResolvedValue()},
      }
    }
  }
})

describe('discord.eventHandlers.onInteractionCreate()', function() {
  afterAll(function() {
    jest.unmock('../../../modules/index.js')
  })

  it('should ignore interactions that are not application commands', async function() {
    const interaction = {
      type: 'FOOBAR',
      commandName: 'command001'
    }

    await onInteractionCreate(interaction)

    expect(modulesMock.module001.commands.cmd001.execute).not.toHaveBeenCalled()
    expect(modulesMock.module001.commands.cmd002.execute).not.toHaveBeenCalled()
    expect(modulesMock.module002.commands.cmd003.execute).not.toHaveBeenCalled()
  })
  
  it('should execute commands', async function() {
    const interaction = {
      type: 'APPLICATION_COMMAND',
      commandName: 'command001'
    }

    await onInteractionCreate(interaction)

    expect(modulesMock.module001.commands.cmd001.execute).toHaveBeenCalledWith(interaction)
    expect(modulesMock.module001.commands.cmd002.execute).not.toHaveBeenCalled()
    expect(modulesMock.module002.commands.cmd003.execute).not.toHaveBeenCalled()
  })

  it('should handle command executions failing', async function() {
    modulesMock.module001.commands.cmd001.execute.mockRejectedValue('Command error')
    
    const interaction = {
      type: 'APPLICATION_COMMAND',
      commandName: 'command001'
    }

    await onInteractionCreate(interaction)

    expect(modulesMock.module001.commands.cmd001.execute).toHaveBeenCalledWith(interaction)
    expect(modulesMock.module001.commands.cmd002.execute).not.toHaveBeenCalled()
    expect(modulesMock.module002.commands.cmd003.execute).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Command error')
  })
})