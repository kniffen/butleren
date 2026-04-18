import fetch, { Response } from 'node-fetch';
import { getOpenWeatherForecastData } from './getOpenWeatherForecastData';

describe('getOpenWeatherForecastData()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should fetch forecasdt data from OpenWeather', async () => {
    fetchMock.mockResolvedValue({
      ok:   true,
      json: async () => ['foo', 'bar']
    } as unknown as Response);


    const data = await getOpenWeatherForecastData(35, 139);

    expect(fetchMock).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139&units=metric&APPID=open-weather-map-api-key');
    expect(data).toEqual(['foo', 'bar']);
  });

  test('It should throw an error if the fetch request fails', async () => {
    fetchMock.mockResolvedValue({
      ok:         false,
      status:     500,
      statusText: 'Internal Server Error',
      text:       async () => 'Error message'
    } as unknown as Response);

    await expect(getOpenWeatherForecastData(35, 139)).rejects.toThrow('Unable to fetch forecast data: 500 Internal Server Error');
  });
});