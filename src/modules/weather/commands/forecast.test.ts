import * as getWeatherLocation  from '../utils/getWeatherLocation';
import * as getOpenWeatherForecastData  from '../utils/getOpenWeatherForecastData';
import * as getGuildSettings  from '../../../discord/database/getGuildSettings';
import * as createWeatherForecastEmbed from '../utils/createWeatherForecastEmbed';
import { forecastCommand } from './forecast';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildSettings } from '../../../types';

describe('forecast command', () => {
  const getWeatherLocationMock = jest.spyOn(getWeatherLocation, 'getWeatherLocation').mockImplementation();
  const getOpenWeatherForecastDataMock = jest.spyOn(getOpenWeatherForecastData, 'getOpenWeatherForecastData').mockImplementation();
  const getGuildSettingsMock = jest.spyOn(getGuildSettings, 'getGuildSettings').mockImplementation();
  const createWeatherForecastEmbedMock = jest.spyOn(createWeatherForecastEmbed, 'createWeatherForecastEmbed').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should not be locked', () => {
    expect(forecastCommand.isLocked).toBe(false);
  });

  test('It should have a slash command builder', () => {
    expect(forecastCommand.slashCommandBuilder.toJSON()).toEqual(expect.objectContaining({
      name:        'forecast',
      description: 'Get a weather forecast report'
    }));
  });

  describe('execute', () => {
    test('It should reply with a forecast embed', async () => {
      getWeatherLocationMock.mockResolvedValueOnce({ lat: 1, lon: 2, name: 'foo' });
      getGuildSettingsMock.mockResolvedValueOnce({ color: '#F0000' } as unknown as GuildSettings);
      createWeatherForecastEmbedMock.mockReturnValueOnce('embed' as unknown as EmbedBuilder);

      await forecastCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(getGuildSettingsMock).toHaveBeenCalledWith({ id: 'guild-id' });
      expect(getOpenWeatherForecastDataMock).toHaveBeenCalledWith(1, 2);
      expect(createWeatherForecastEmbedMock).toHaveBeenCalledWith({ color: '#F0000' }, undefined, { lat: 1, lon: 2, name: 'foo' });
      expect(editReply).toHaveBeenCalledWith({ embeds: ['embed' as unknown as EmbedBuilder] });
    });

    test('It should do nothing if no location was found', async () => {
      getWeatherLocationMock.mockResolvedValueOnce(null);

      await forecastCommand.execute(commandInteraction);

      expect(deferReply).not.toHaveBeenCalled();
      expect(getGuildSettingsMock).not.toHaveBeenCalled();
      expect(getOpenWeatherForecastDataMock).not.toHaveBeenCalled();
      expect(createWeatherForecastEmbedMock).not.toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
    });

    test('It should reply with an error message if something goes wrong', async () => {
      getWeatherLocationMock.mockResolvedValueOnce({ lat: 1, lon: 2, name: 'foo' });
      getOpenWeatherForecastDataMock.mockRejectedValueOnce(new Error('foobar'));

      await forecastCommand.execute(commandInteraction);

      expect(deferReply).toHaveBeenCalled();
      expect(editReply).not.toHaveBeenCalled();
      expect(deleteReply).toHaveBeenCalled();
      expect(followUp).toHaveBeenCalledWith({
        content:   'Sorry, I was unable to get a weather forecast for you. Please try again later.',
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