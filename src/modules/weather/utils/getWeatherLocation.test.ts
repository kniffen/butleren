import { getWeatherLocation } from './getWeatherLocation';
import * as getGeoLocation from '../../../utils/getGeoLocation';
import * as getDBEntry from '../../../database/utils/getDBEntry';
import { ChatInputCommandInteraction } from 'discord.js';
import { OpenWeatherGeoLocation } from '../../../utils/getGeoLocation';
import { UserDBEntry } from '../../../types';

describe('getWeatherLocation', () => {
  const getGeoLocationMock = jest.spyOn(getGeoLocation, 'getGeoLocation').mockImplementation();
  const getDBEntryMock     = jest.spyOn(getDBEntry,     'getDBEntry').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Location name', () => {
    test('It should get the weather location for a location name', async () => {
      getOptionSpy.mockImplementation((name: string) => ('location' === name) ? { value: 'London' } : null);
      getGeoLocationMock.mockResolvedValueOnce({ lat: 51.5074, lon: -0.1278, name: 'London', country: 'GB' } as OpenWeatherGeoLocation);

      const location = await getWeatherLocation(commandInteraction );
      expect(getGeoLocationMock).toHaveBeenCalledWith({ name: 'London' });
      expect(location).toEqual({ lat: 51.5074, lon: -0.1278, name: 'London (GB)' });
      expect(replySpy).not.toHaveBeenCalled();
    });

    test('It should return null and reply with an error message if no location was found', async () => {
      getOptionSpy.mockImplementation((name: string) => ('location' === name) ? { value: 'InvalidLocation' } : null);
      getGeoLocationMock.mockResolvedValueOnce(undefined);

      const location = await getWeatherLocation(commandInteraction );
      expect(getGeoLocationMock).toHaveBeenCalledWith({ name: 'InvalidLocation' });
      expect(location).toBeNull();
      expect(replySpy).toHaveBeenCalledWith({
        content:   'Sorry, I was unable to find that location. Please try again with a different location.',
        ephemeral: true
      });
    });
  });

  describe('Zip code', () => {
    test('It should get the weather location for a zip code', async () => {
      getOptionSpy.mockImplementation((name: string) => ('zip' === name) ? { value: '12345' } : null);
      getGeoLocationMock.mockResolvedValueOnce({ lat: 40.7128, lon: -74.0060, name: 'New York', country: 'US' } as OpenWeatherGeoLocation);

      const location = await getWeatherLocation(commandInteraction );
      expect(getGeoLocationMock).toHaveBeenCalledWith({ zip: '12345' });
      expect(location).toEqual({ lat: 40.7128, lon: -74.0060, name: 'New York (US)' });
      expect(replySpy).not.toHaveBeenCalled();
    });

    test('It should return null and reply with an error message if no location was found for the zip code', async () => {
      getOptionSpy.mockImplementation((name: string) => ('zip' === name) ? { value: '99999' } : null);
      getGeoLocationMock.mockResolvedValueOnce(undefined);

      const location = await getWeatherLocation(commandInteraction );
      expect(getGeoLocationMock).toHaveBeenCalledWith({ zip: '99999' });
      expect(location).toBeNull();
      expect(replySpy).toHaveBeenCalledWith({
        content:   'Sorry, I was unable to find a location with that ZIP code. Please try again with a different ZIP code.',
        ephemeral: true
      });
    });
  });

  describe('User location', () => {
    test('It should get the weather location for a user with a set location', async () => {
      getOptionSpy.mockImplementation((name: string) => ('user' === name) ? { user: { id: 'user-id', displayName: 'Test User' } } : null);
      getDBEntryMock.mockResolvedValueOnce({ id: 'user-id', lat: 34.0522, lon: -118.2437 } as UserDBEntry);

      const location = await getWeatherLocation(commandInteraction );
      expect(getDBEntryMock).toHaveBeenCalledWith('users', { id: 'user-id' });
      expect(location).toEqual({ lat: 34.0522, lon: -118.2437, name: 'Test User' });
      expect(replySpy).not.toHaveBeenCalled();
    });

    test('It should use the command user if no user was specified', async () => {
      getOptionSpy.mockImplementation(() => null);
      getDBEntryMock.mockResolvedValueOnce({ id: '1234', lat: 48.8566, lon: 2.3522 } as UserDBEntry);

      const location = await getWeatherLocation(commandInteraction );
      expect(getDBEntryMock).toHaveBeenCalledWith('users', { id: '1234' });
      expect(location).toEqual({ lat: 48.8566, lon: 2.3522, name: 'Command User' });
      expect(replySpy).not.toHaveBeenCalled();
    });

    test('It should return null and reply with an error message if the user has no set location', async () => {
      getOptionSpy.mockImplementation(() => null);
      getDBEntryMock.mockResolvedValueOnce({ id: '1234' } as UserDBEntry);

      const location = await getWeatherLocation(commandInteraction );
      expect(getDBEntryMock).toHaveBeenCalledWith('users', { id: '1234' });
      expect(location).toBeNull();
      expect(replySpy).toHaveBeenCalledWith({
        content:   'The specified user has not set a location. They can set their location using `/location set`.',
        ephemeral: true
      });
    });
  });
});

const getOptionSpy = jest.fn();
const replySpy = jest.fn();

const commandInteraction = {
  user:    { id: '1234', displayName: 'Command User' },
  reply:   replySpy,
  options: {
    get: getOptionSpy
  }
} as unknown as ChatInputCommandInteraction;