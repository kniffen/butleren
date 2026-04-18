import * as getWeatherLocation  from '../utils/getWeatherLocation';
import * as getOpenWeatherData  from '../utils/getOpenWeatherData';
import * as getGuildSettings  from '../../../discord/database/getGuildSettings';
import * as createWeatherEmbed from '../utils/createWeatherEmbed';
import { weatherCommand } from './weather';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildSettings } from '../../../types';

describe('weather command', () => {
  const getWeatherLocationMock = jest.spyOn(getWeatherLocation, 'getWeatherLocation').mockImplementation();
  const getOpenWeatherDataMock = jest.spyOn(getOpenWeatherData, 'getOpenWeatherData').mockImplementation();
  const getGuildSettingsMock = jest.spyOn(getGuildSettings, 'getGuildSettings').mockImplementation();
  const createWeatherEmbedMock = jest.spyOn(createWeatherEmbed, 'createWeatherEmbed').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('IT should not be locked', () => {
    expect(weatherCommand.isLocked).toBe(false);
  });

  test('It should have a slash command builder', () => {
    expect(weatherCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'weather',
      description: 'Get a weather report'
    }));
  });

  describe('execute', () => {
    test('It should reply with a weather embed', async () => {
      getWeatherLocationMock.mockResolvedValueOnce({ lat: 1, lon: 2, name: 'foo' });
      getGuildSettingsMock.mockResolvedValueOnce({ color: '#F0000' } as unknown as GuildSettings);
      createWeatherEmbedMock.mockReturnValueOnce('embed' as unknown as EmbedBuilder);

      await weatherCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(getGuildSettingsMock).toHaveBeenCalledWith({ id: 'guild-id' });
      expect(getOpenWeatherDataMock).toHaveBeenCalledWith(1, 2);
      expect(createWeatherEmbedMock).toHaveBeenCalledWith({ color: '#F0000' }, undefined, { lat: 1, lon: 2, name: 'foo' });
      expect(editReply).toHaveBeenCalledWith({ embeds: ['embed' as unknown as EmbedBuilder] });
    });

    test('It should do nothing if no location was found', async () => {
      getWeatherLocationMock.mockResolvedValueOnce(null);

      await weatherCommand.execute(commandInteraction);

      expect(deferReply).not.toHaveBeenCalled();
      expect(getGuildSettingsMock).not.toHaveBeenCalled();
      expect(getOpenWeatherDataMock).not.toHaveBeenCalled();
      expect(createWeatherEmbedMock).not.toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
    });

    test('It should reply with an error message if something goes wrong', async () => {
      getWeatherLocationMock.mockResolvedValueOnce({ lat: 1, lon: 2, name: 'foo' });
      getOpenWeatherDataMock.mockRejectedValueOnce(new Error('foobar'));

      await weatherCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
      expect(deleteReply).toHaveBeenCalled();
      expect(followUp).toHaveBeenCalledWith({
        content:   'Sorry, I was unable to get a weather report for you. Please try again later.',
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