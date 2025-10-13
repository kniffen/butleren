import fetch from 'node-fetch';
import { logDebug, logError, logInfo } from '../../logs/logger';
import { OPEN_WEATHER_MAP_API_KEY } from '../constants';
import type { OpenWeatherPrecip } from './getOpenWeatherData';

export const getOpenWeatherForecastData = async function(lat: number, lon: number): Promise<OpenWeatherForecastData> {
  const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
  url.searchParams.set('lat', lat.toString());
  url.searchParams.set('lon', lon.toString());
  url.searchParams.set('units', 'metric');
  url.searchParams.set('APPID', OPEN_WEATHER_MAP_API_KEY);

  const res = await fetch(url.toString());
  logInfo('Weather', 'Fetched weather data', { url: url.toString(), status: res.status });
  if (!res.ok) {
    logError('Weather', `Unable to fetch forecast data: ${res.status} ${res.statusText}`, { url: url.toString() });
    throw new Error(`Unable to fetch forecast data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as OpenWeatherForecastData;
  logDebug('Weather', 'Fetched forecast data', { url: url.toString(), data });
  return data;
};

export interface OpenWeatherForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherForecast[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface OpenWeatherForecast {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: OpenWeatherPrecip;
    snow?: OpenWeatherPrecip;
    sys: {
      pod: string;
    };
    dt_txt: string;
}