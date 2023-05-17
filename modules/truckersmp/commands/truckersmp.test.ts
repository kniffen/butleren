import { ChatInputCommandInteraction } from 'discord.js';

import * as command from './truckersmp';
import statusSubCommand from './truckersmp/status';

jest.mock(
  './truckersmp/status',
  () => ({ __esModule: true, default: jest.fn() })
);

describe('modules.truckersmp.commands.truckersmp', function () {
  it('Should contain certain properties', function () {
    expect(command.isLocked).toEqual(false);
    expect(command.data.toJSON()).toEqual({
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

    await command.execute(interaction);

    expect(statusSubCommand).toHaveBeenCalledWith(interaction);
  });
});