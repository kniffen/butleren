import { formatTemp } from './formatTemp';

describe('formatTemp', () => {
  test('It should format temperature to celsius and fahrenheit', () => {
    expect(formatTemp(0)).toEqual(['0°C', '32°F']);
    expect(formatTemp(20)).toEqual(['20°C', '68°F']);
    expect(formatTemp(-20)).toEqual(['-20°C', '-4°F']);
    expect(formatTemp(36.6)).toEqual(['37°C', '98°F']);
  });
});