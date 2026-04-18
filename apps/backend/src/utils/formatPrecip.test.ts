import { formatPrecip } from './formatPrecip';

describe('formatPrecip', () => {
  test('It should format rain precipitation', () => {
    expect(formatPrecip({ rain: { '1h': 2 } })).toEqual({ name: '🌧️ Rain (1h)', amount: ['2mm', '0.08"'] });
    expect(formatPrecip({ rain: { '3h': 4 } })).toEqual({ name: '🌧️ Rain (3h)', amount: ['4mm', '0.16"'] });
    expect(formatPrecip({ rain: { '1h': 8, '3h': 16 } })).toEqual({ name: '🌧️ Rain (1h)', amount: ['8mm', '0.31"'] });
  });

  test('It should format snow precipitation', () => {
    expect(formatPrecip({ snow: { '1h': 2 } })).toEqual({ name: '🌨️ Snow (1h)', amount: ['2mm', '0.08"'] });
    expect(formatPrecip({ snow: { '3h': 4 } })).toEqual({ name: '🌨️ Snow (3h)', amount: ['4mm', '0.16"'] });
    expect(formatPrecip({ snow: { '1h': 8, '3h': 16 } })).toEqual({ name: '🌨️ Snow (1h)', amount: ['8mm', '0.31"'] });
  });

  test('It should fall back to 0mm of rain if no precipitation is given', () => {
    expect(formatPrecip({})).toEqual({ name: '🌧️ Rain (3h)', amount: ['0mm', '0.00"'] });
  });
});