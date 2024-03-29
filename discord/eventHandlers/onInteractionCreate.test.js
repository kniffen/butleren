import { InteractionType } from 'discord.js'

import onInteractionCreate from './onInteractionCreate.js'

import * as modulesMock from '../../modules/index.js'

jest.mock('../../modules/index.js', () => {
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
    jest.unmock('../../modules/index.js')
  })

  it('should ignore interactions that are not application commands', async function() {
    await Promise.all([
      onInteractionCreate({type: InteractionType.ApplicationCommandAutocomplete, commandName: 'command001'}),
      onInteractionCreate({type: InteractionType.MessageComponent,               commandName: 'command001'}),
      onInteractionCreate({type: InteractionType.ModalSubmit,                    commandName: 'command001'}),
      onInteractionCreate({type: InteractionType.Ping,                           commandName: 'command001'})
    ])

    expect(modulesMock.module001.commands.cmd001.execute).not.toHaveBeenCalled()
    expect(modulesMock.module001.commands.cmd002.execute).not.toHaveBeenCalled()
    expect(modulesMock.module002.commands.cmd003.execute).not.toHaveBeenCalled()
  })
  
  it('should execute commands', async function() {
    const interaction = {
      type: InteractionType.ApplicationCommand,
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
      type: InteractionType.ApplicationCommand,
      commandName: 'command001'
    }

    await onInteractionCreate(interaction)

    expect(modulesMock.module001.commands.cmd001.execute).toHaveBeenCalledWith(interaction)
    expect(modulesMock.module001.commands.cmd002.execute).not.toHaveBeenCalled()
    expect(modulesMock.module002.commands.cmd003.execute).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Command error')
  })
})