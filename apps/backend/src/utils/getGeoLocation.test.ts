import fetch, { Response } from 'node-fetch';
import { getGeoLocation } from './getGeoLocation';

describe('getGeoLocation()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should return a geo location based on a location name', async () => {
    fetchMock.mockResolvedValue({
      ok:   true,
      json: async () => ['foo', 'bar']
    } as unknown as Response);

    const geoLocation = await getGeoLocation({ name: 'London' });
    expect(fetchMock).toHaveBeenCalledWith('http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=open-weather-map-api-key');
    expect(geoLocation).toBe('foo');
  });

  test('It should return a geo location based on a zip code', async () => {
    fetchMock.mockResolvedValue({
      ok:   true,
      json: async () => ('bar')
    } as unknown as Response);

    const geoLocation = await getGeoLocation({ zip: '12345' });
    expect(fetchMock).toHaveBeenCalledWith('http://api.openweathermap.org/geo/1.0/zip?zip=12345&limit=1&appid=open-weather-map-api-key');
    expect(geoLocation).toBe('bar');
  });

  test('It should return a geo location based on latitude and longitude', async () => {
    fetchMock.mockResolvedValue({
      ok:   true,
      json: async () => ('baz')
    } as unknown as Response);

    const geoLocation = await getGeoLocation({ lat: 51.5074, lon: -0.1278 });
    expect(fetchMock).toHaveBeenCalledWith('http://api.openweathermap.org/geo/1.0/reverse?lat=51.5074&lon=-0.1278&limit=1&appid=open-weather-map-api-key');
    expect(geoLocation).toBe('baz');
  });
});