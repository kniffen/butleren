import { OpenWeatherPrecip } from '../modules/weather/utils/getOpenWeatherData';

export interface Precip {
  name: string;
  amount: [string, string];
}

const mmToInch = (mm: number): string => (mm * 0.0393701).toFixed(2);
export const formatPrecipAmount = (mm: number): [string, string] => [`${Math.round(mm)}mm`, `${mmToInch(mm)}"`];
export const formatPrecip = function({ rain, snow }: {rain?: OpenWeatherPrecip, snow?: OpenWeatherPrecip}): Precip {
  const precip = [
    { name: '🌧️ Rain (1h)', amount: rain?.['1h'] || 0 },
    { name: '🌧️ Rain (3h)', amount: rain?.['3h'] || 0 },
    { name: '🌨️ Snow (1h)', amount: snow?.['1h'] || 0 },
    { name: '🌨️ Snow (3h)', amount: snow?.['3h'] || 0 },
  ].find(precip => precip.amount) || { name: '🌧️ Rain (3h)', amount: 0 };

  return { name: precip.name, amount: formatPrecipAmount(precip.amount) };
};
