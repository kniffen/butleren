import { logger } from '../../../logger/logger.js'

const BASE_URL = 'http://api.openweathermap.org';

export const getGeoLocation = async (location) => {
  try {
    const isNumber = /^\d+$/.test(location);
    const path = isNumber ? '/geo/1.0/zip' : '/geo/1.0/direct';
    const url = new URL(`${BASE_URL}${path}`);

    if (isNumber) {
      url.searchParams.set('zip', location);
    } else {
      url.searchParams.set('q', location);
    }
    url.searchParams.set('limit', '1');
    url.searchParams.set('appid', process.env.OPEN_WEATHER_MAP_API_KEY);


    logger.info(`Open Weather API: ${path} request`, {url: url.toString()});
    const data = await fetch(url).then(res => res.json());
    logger.debug(`Open Weather API: ${path} response body`, {data});

    if (0 === data.length) {
      return null;
    }

    if (isNumber) {
      return {
        name: data.name,
        country: data.country,
        state: null,
        lat: data.lat,
        lon: data.lon,
      }
    }

    const item = data[0];
    return {
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    };

  } catch (err) {
    logger.error('Open Weather API error', {err});
    return null;
  }
}