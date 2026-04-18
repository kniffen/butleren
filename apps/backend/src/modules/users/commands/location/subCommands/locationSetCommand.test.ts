import { locationSetCommand } from './locationSetCommand';
import * as getGeoLocation from '../../../../../utils/getGeoLocation';
import * as getMapBuffer from '../../../../../utils/getMapBuffer';
import * as insertOrReplaceDBEntry from '../../../../../database/utils/insertOrReplaceDBEntry';
import { ChatInputCommandInteraction } from 'discord.js';

describe('locationSetCommand()', () => {
  const insertOrReplaceDBEntrySpy = jest.spyOn(insertOrReplaceDBEntry, 'insertOrReplaceDBEntry').mockResolvedValue();
  const getGeoLocationSpy = jest.spyOn(getGeoLocation, 'getGeoLocation').mockResolvedValue({ name: 'Test City', country: 'TC', lat: 12.34, lon: 56.78 } as getGeoLocation.OpenWeatherGeoLocation);
  const getMapBufferSpy = jest.spyOn(getMapBuffer, 'getMapBuffer').mockResolvedValue(Buffer.from('test-map-buffer'));

  const deferReplySpy = jest.fn();
  const editReplySpy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should set a user\'s location based on the location name', async () => {
    const commandInteraction = {
      user:    { id: 'user123' },
      options: {
        get: (key: string) => ('name' === key) ? { value: 'Test City' } : null
      },
      deferReply: deferReplySpy,
      editReply:  editReplySpy,
    } as unknown as ChatInputCommandInteraction;

    await locationSetCommand(commandInteraction);

    expect(getGeoLocationSpy).toHaveBeenCalledWith({ name: 'Test City' });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('users', { id: 'user123', lat: 12.34, lon: 56.78 });
    expect(getMapBufferSpy).toHaveBeenCalledWith(12.34, 56.78);
    expect(deferReplySpy).toHaveBeenCalledWith({ ephemeral: true });
    expect(editReplySpy).toHaveBeenCalledWith({
      content: 'Your location is now set to Test City (TC)',
      files:   [expect.objectContaining({ name: 'map.png' })],
    });
  });

  test('It should set a user\'s location based on a zip code', async () => {
    const commandInteraction = {
      user:    { id: 'user123' },
      options: {
        get: (key: string) => ('zip' === key) ? { value: '12345' } : null
      },
      deferReply: deferReplySpy,
      editReply:  editReplySpy,
    } as unknown as ChatInputCommandInteraction;

    await locationSetCommand(commandInteraction);

    expect(getGeoLocationSpy).toHaveBeenCalledWith({ zip: '12345' });
    expect(insertOrReplaceDBEntrySpy).toHaveBeenCalledWith('users', { id: 'user123', lat: 12.34, lon: 56.78 });
    expect(getMapBufferSpy).toHaveBeenCalledWith(12.34, 56.78);
    expect(deferReplySpy).toHaveBeenCalledWith({ ephemeral: true });
    expect(editReplySpy).toHaveBeenCalledWith({
      content: 'Your location is now set to Test City (TC)',
      files:   [expect.objectContaining({ name: 'map.png' })],
    });
  });

  test('It should handle invalid locations gracefully', async () => {
    getGeoLocationSpy.mockResolvedValueOnce(undefined);

    const commandInteraction = {
      user:    { id: 'user123' },
      options: {
        get: (key: string) => ('name' === key) ? { value: 'Invalid City' } : null
      },
      deferReply: deferReplySpy,
      editReply:  editReplySpy,
    } as unknown as ChatInputCommandInteraction;

    await locationSetCommand(commandInteraction);

    expect(getGeoLocationSpy).toHaveBeenCalledWith({ name: 'Invalid City' });
    expect(insertOrReplaceDBEntrySpy).not.toHaveBeenCalled();
    expect(getMapBufferSpy).not.toHaveBeenCalled();
    expect(deferReplySpy).toHaveBeenCalledWith({ ephemeral: true });
    expect(editReplySpy).toHaveBeenCalledWith('Invalid location, please try again');
  });
});