import { formatWindSpeed } from './formatWindSpeed';

describe('formatWindSpeed', () => {
  test('It should format wind speed to m/s and mph', () => {
    expect(formatWindSpeed(0)).toEqual(['0.0m/s', '0.0mph']);
    expect(formatWindSpeed(5)).toEqual(['5.0m/s', '11.2mph']);
    expect(formatWindSpeed(10)).toEqual(['10.0m/s', '22.4mph']);
    expect(formatWindSpeed(7.5)).toEqual(['7.5m/s', '16.8mph']);
  });
});