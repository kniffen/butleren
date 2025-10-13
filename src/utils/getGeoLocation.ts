import fetch from 'node-fetch';
import { OPEN_WEATHER_MAP_API_KEY } from '../modules/weather/constants';
import { logDebug, logInfo } from '../modules/logs/logger';

export interface OpenWeatherGeoLocation {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export const getGeoLocation = async function(args: {name: string} | {zip: string} | {lat: number, lon: number}): Promise<OpenWeatherGeoLocation | undefined>  {
  let url: URL;

  if ('name' in args) {
    url = new URL('http://api.openweathermap.org/geo/1.0/direct');
    url.searchParams.set('q', args.name);

  } else if ('zip' in args) {
    url = new URL('http://api.openweathermap.org/geo/1.0/zip');
    url.searchParams.set('zip', args.zip);
  } else {
    url = new URL('http://api.openweathermap.org/geo/1.0/reverse');
    url.searchParams.set('lat', args.lat.toString());
    url.searchParams.set('lon', args.lon.toString());
    url.searchParams.set('limit', '1');
  }

  url.searchParams.set('limit', '1');
  url.searchParams.set('appid', OPEN_WEATHER_MAP_API_KEY);

  logInfo('OpenWeather', 'Fetching geo location', { url: url.toString() });
  const data = await fetch(url.toString()).then(res => res.json()) as OpenWeatherGeoLocation | OpenWeatherGeoLocation[];
  logDebug('OpenWeather', 'Fetched geo location', { url: url.toString(), data });

  return Array.isArray(data) ? data[0] : data;
};