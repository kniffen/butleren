import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { OPEN_WEATHER_MAP_API_KEY } from '../constants';

export const getOpenWeatherData = async function(lat: number, lon: number): Promise<OpenWeatherData> {
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lon.toString());
  url.searchParams.set('units', 'metric');
  url.searchParams.set('APPID', OPEN_WEATHER_MAP_API_KEY);

  const res = await fetch(url.toString());
  logInfo('Weather', 'Fetched weather data', { url: url.toString(), status: res.status });
  if (!res.ok) {
    logError('Weather', `Unable to fetch weather data: ${res.status} ${res.statusText}`, { url: url.toString() });
    throw new Error(`Unable to fetch weather data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as OpenWeatherData;
  logDebug('Weather', 'Fetched weather data', { url: url.toString(), data });
  return data;
};

export interface OpenWeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  rain?: OpenWeatherPrecip;
  snow?: OpenWeatherPrecip;
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherPrecip {
  '1h'?: number;
  '3h'?: number;
}
