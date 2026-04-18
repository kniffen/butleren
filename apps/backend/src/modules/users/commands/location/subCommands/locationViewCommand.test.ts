import { locationViewCommand } from './locationViewCommand';
import * as getGeoLocation  from '../../../../../utils/getGeoLocation';
import * as getMapBuffer  from '../../../../../utils/getMapBuffer';
import * as getDBEntry from '../../../../../database/utils/getDBEntry';
import { OpenWeatherGeoLocation } from '../../../../../utils/getGeoLocation';
import { ChatInputCommandInteraction } from 'discord.js';

describe('locationViewCommand()', () => {
  const getGeoLocationSpy = jest.spyOn(getGeoLocation, 'getGeoLocation').mockResolvedValue({ name: 'Test City', country: 'TC' } as OpenWeatherGeoLocation);
  const getMapBufferSpy   = jest.spyOn(getMapBuffer, 'getMapBuffer').mockResolvedValue(Buffer.from('test-map-buffer'));
  const getDBEntrySpy     = jest.spyOn(getDBEntry, 'getDBEntry').mockResolvedValue({ id: '1234', lat: 12.34, lon: 56.78 });

  const deferReplySpy = jest.fn();
  const editReplySpy = jest.fn();
  const commandInteraction = {
    user:       { id: 'user123' },
    deferReply: deferReplySpy,
    editReply:  editReplySpy,
    // Simulate other necessary properties/methods if needed
  } as unknown as ChatInputCommandInteraction;

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('It should reply with a user\'s location and map', async () => {
    await locationViewCommand(commandInteraction);

    expect(getDBEntrySpy).toHaveBeenCalledWith('users', { id: 'user123' });
    expect(getGeoLocationSpy).toHaveBeenCalledWith({ lat: 12.34, lon: 56.78 });
    expect(getMapBufferSpy).toHaveBeenCalledWith(12.34, 56.78);
    expect(deferReplySpy).toHaveBeenCalledWith({ ephemeral: true });
    expect(editReplySpy).toHaveBeenCalledWith({
      content: 'Your location is set to Test City (TC)',
      files:   [expect.objectContaining({ name: 'map.png' })],
    });
  });

  test('It should handle users without a set location gracefully', async () => {
    getDBEntrySpy.mockResolvedValueOnce({ id: '1234' });
    await locationViewCommand(commandInteraction);
    getDBEntrySpy.mockResolvedValueOnce({ id: '1234', lat: null, lon: null });
    await locationViewCommand(commandInteraction);

    expect(getDBEntrySpy).toHaveBeenCalledWith('users', { id: 'user123' });
    expect(editReplySpy).toHaveBeenCalledTimes(2);
    expect(editReplySpy).toHaveBeenNthCalledWith(1, 'You currently do not have a location set');
    expect(editReplySpy).toHaveBeenNthCalledWith(2, 'You currently do not have a location set');
  });

  test('It should handle no geo location found gracefully', async () => {
    getGeoLocationSpy.mockResolvedValueOnce(undefined);

    await locationViewCommand(commandInteraction);

    expect(getDBEntrySpy).toHaveBeenCalledWith('users', { id: 'user123' });
    expect(getGeoLocationSpy).toHaveBeenCalledWith({ lat: 12.34, lon: 56.78 });
    expect(editReplySpy).toHaveBeenCalledWith('Your location is set to 12.34,56.78');
  });
});