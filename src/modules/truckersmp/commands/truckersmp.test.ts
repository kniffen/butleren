import { ChatInputCommandInteraction } from 'discord.js';

import { truckersMPCommand } from './truckersmp';
import statusSubCommand from './truckersmp/status';

jest.mock(
  './truckersmp/status',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.truckersmp.commands.truckersmp', function () {
  it('Should contain certain properties', function () {
    expect(truckersMPCommand.isLocked).toEqual(false);
    expect(truckersMPCommand.data.toJSON?.()).toEqual({
      name: 'truckersmp',
      description: 'TruckersMP integration',
      options: [
        {
          name: 'status',
          description: 'Get the current status of TruckersMP servers',
          type: 1,
          options: [],
        }
      ]
    });
  });

  it('Should forward sub commands', async function () {
    const interaction = {
      options: {
        getSubcommand: () => 'status'
      }
    } as ChatInputCommandInteraction;

    await truckersMPCommand.execute(interaction);

    expect(statusSubCommand).toHaveBeenCalledWith(interaction);
  });
});