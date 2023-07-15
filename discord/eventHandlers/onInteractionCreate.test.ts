import {
  ChatInputCommandInteraction,
  Interaction,
  InteractionType,
} from 'discord.js';

import onInteractionCreate from './onInteractionCreate';

import modulesMock from '../../modules';

jest.mock('../../modules', () => {
  return [
    {
      commands: [
        { data: { name: 'command001' }, execute: jest.fn().mockResolvedValue(undefined) },
        { data: { name: 'command002' }, execute: jest.fn().mockResolvedValue(undefined) },
      ]
    },
    {
      commands: [
        { data: { name: 'command003' }, execute: jest.fn().mockResolvedValue(undefined) },
      ]
    }
  ];
});

describe('discord.eventHandlers.onInteractionCreate()', function () {
  const module001 = modulesMock[0];
  const module002 = modulesMock[1];

  const command001 = module001.commands?.[0];
  const command002 = module001.commands?.[1];
  const command003 = module002.commands?.[0];

  afterAll(function () {
    jest.unmock('../../modules');
  });

  it('should ignore interactions that are not application commands', async function () {
    await Promise.all([
      onInteractionCreate({ type: InteractionType.ApplicationCommandAutocomplete, commandName: 'command001' } as unknown as ChatInputCommandInteraction),
      onInteractionCreate({ type: InteractionType.MessageComponent,               commandName: 'command001' } as unknown as Interaction),
      onInteractionCreate({ type: InteractionType.ModalSubmit,                    commandName: 'command001' } as unknown as Interaction),
      onInteractionCreate({ type: InteractionType.Ping,                           commandName: 'command001' } as unknown as Interaction)
    ]);

    expect(command001?.execute).not.toHaveBeenCalled();
    expect(command002?.execute).not.toHaveBeenCalled();
    expect(command003?.execute).not.toHaveBeenCalled();
  });

  it('should execute commands', async function () {
    const interaction = {
      type: InteractionType.ApplicationCommand,
      commandName: 'command001'
    } as Interaction;

    await onInteractionCreate(interaction);

    expect(command001?.execute).toHaveBeenCalledWith(interaction);
    expect(command002?.execute).not.toHaveBeenCalled();
    expect(command003?.execute).not.toHaveBeenCalled();
  });

  it('should handle command executions failing', async function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    command001?.execute.mockRejectedValue('Command error');

    const interaction = {
      type: InteractionType.ApplicationCommand,
      commandName: 'command001'
    } as Interaction;

    await onInteractionCreate(interaction);

    expect(command001?.execute).toHaveBeenCalledWith(interaction);
    expect(command002?.execute).not.toHaveBeenCalled();
    expect(command003?.execute).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Command error');
  });
});