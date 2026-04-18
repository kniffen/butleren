import * as getWeatherLocation  from '../utils/getWeatherLocation';
import * as getGooglePollenData  from '../utils/getGooglePollenData';
import * as getGuildSettings  from '../../../discord/database/getGuildSettings';
import * as createPollenEmbed from '../utils/createPollenEmbed';
import { pollenCommand } from './pollen';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildSettings } from '../../../types';

describe('pollen command', () => {
  const getWeatherLocationMock = jest.spyOn(getWeatherLocation, 'getWeatherLocation').mockImplementation();
  const getGooglePollenDataMock = jest.spyOn(getGooglePollenData, 'getGooglePollenData').mockImplementation();
  const getGuildSettingsMock = jest.spyOn(getGuildSettings, 'getGuildSettings').mockImplementation();
  const createPollenEmbedMock = jest.spyOn(createPollenEmbed, 'createPollenEmbed').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('IT should not be locked', () => {
    expect(pollenCommand.isLocked).toBe(false);
  });

  test('It should have a slash command builder', () => {
    expect(pollenCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'pollen',
      description: 'Get a pollen report'
    }));
  });

  describe('execute', () => {
    test('It should reply with a pollen embed', async () => {
      getWeatherLocationMock.mockResolvedValueOnce({ lat: 1, lon: 2, name: 'foo' });
      getGuildSettingsMock.mockResolvedValueOnce({ color: '#F0000' } as unknown as GuildSettings);
      createPollenEmbedMock.mockReturnValueOnce('embed' as unknown as EmbedBuilder);

      await pollenCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(getGuildSettingsMock).toHaveBeenCalledWith({ id: 'guild-id' });
      expect(getGooglePollenDataMock).toHaveBeenCalledWith(1, 2);
      expect(createPollenEmbedMock).toHaveBeenCalledWith({ color: '#F0000' }, undefined, { lat: 1, lon: 2, name: 'foo' });
      expect(editReply).toHaveBeenCalledWith({ embeds: ['embed' as unknown as EmbedBuilder] });
    });

    test('It should do nothing if no location was found', async () => {
      getWeatherLocationMock.mockResolvedValueOnce(null);

      await pollenCommand.execute(commandInteraction);

      expect(deferReply).not.toHaveBeenCalled();
      expect(getGuildSettingsMock).not.toHaveBeenCalled();
      expect(getGooglePollenDataMock).not.toHaveBeenCalled();
      expect(createPollenEmbedMock).not.toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
    });

    test('It should reply with an error message if something goes wrong', async () => {
      getWeatherLocationMock.mockResolvedValueOnce({ lat: 1, lon: 2, name: 'foo' });
      getGooglePollenDataMock.mockRejectedValueOnce(new Error('foobar'));

      await pollenCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
      expect(deleteReply).toHaveBeenCalled();
      expect(followUp).toHaveBeenCalledWith({
        content:   'Sorry, I was unable to get a pollen report for you. Please try again later.',
        ephemeral: true
      });
    });
  });
});

const deferReply = jest.fn();
const editReply = jest.fn();
const deleteReply = jest.fn();
const followUp = jest.fn();
const commandInteraction = {
  guild: { id: 'guild-id' },
  deferReply,
  editReply,
  deleteReply,
  followUp
} as unknown as ChatInputCommandInteraction;