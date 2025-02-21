import { logger } from '../../../logger/logger.js'

const BASE_URL = 'http://api.openweathermap.org';
const PATH     = '/geo/1.0/direct';

export const getGeoLocation = async (location) => {
  try {
    const url = new URL(`${BASE_URL}${PATH}`);
    url.searchParams.append('q', location);
    url.searchParams.append('limit', '1');
    url.searchParams.append('appid', process.env.OPEN_WEATHER_MAP_API_KEY);

    logger.info(`Open Weather API: ${PATH} request`, {url: url.toString()});
    const data = await fetch(url).then(res => res.json());
    logger.debug(`Open Weather API: ${PATH} response body`, {data});

    if (data.length === 0) {
      return null;
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
    logger.error(`Open Weather API: ${PATH} error`, {err});
    return null;
  }
}