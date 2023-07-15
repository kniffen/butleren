import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import status from './status';

describe('modules.truckersmp.commands.truckersmp.status()', function () {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
  const interaction = {
    deferReply: jest.fn(),
    editReply: jest.fn()
  } as unknown as ChatInputCommandInteraction;

  beforeEach(function () {
    jest.clearAllMocks();
  });

  afterAll(function () {
    jest.restoreAllMocks();
  });

  it('Should respond with the current status of TruckersMP servers', async function () {
    fetchMock.mockImplementation(async (url) => ({
      json: async () => {
        switch (url) {
          case 'https://api.truckersmp.com/v2/game_time':
            return { game_time: 150 };

          case 'https://api.truckersmp.com/v2/servers':
            return {
              response: [
                {
                  name: 'Foo',
                  online: true,
                  players: 1111,
                  maxplayers: 9999
                },
                {
                  name: 'Bar',
                  online: false,
                  players: 0,
                  maxplayers: 9999
                }
              ]
            };
        }
      }
    } as Response));

    const expectedEmbed = new EmbedBuilder();
    expectedEmbed.setTitle('TruckersMP server status');
    expectedEmbed.setColor('#B92025');
    expectedEmbed.setFooter({ text: 'Current in-game time: 02:30' });
    expectedEmbed.addFields(
      { name: '🟢 Foo', value: 'Players: 1,111/9,999', inline: true },
      { name: '🔴 Bar', value: 'Players: 0/9,999', inline: true }
    );

    await status(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith({
      embeds: [expectedEmbed]
    });
  });

  it('Should respond with a specific message if there was an issue fetching the data', async function () {
    const err = new Error('Error message');
    fetchMock.mockImplementation(async () => {
      throw err;
    });

    await status(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(err);
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: 'Sorry, I was unable fetch the current status of TruckersMP for you :(',
    });
  });

});