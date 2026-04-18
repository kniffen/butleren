import { latLonToTile } from './latLonToTile';

describe('latLonToTile()', () => {
  test('It should convert latitude and longitude to tile coordinates', () => {
    expect(latLonToTile(0, 0, 1)).toEqual({ x: 1, y: 1 });
    expect(latLonToTile(85.0511, 180, 2)).toEqual({ x: 4, y: 0 });
    expect(latLonToTile(-85.0511, -180, 2)).toEqual({ x: 0, y: 3 });
    expect(latLonToTile(45, 45, 3)).toEqual({ x: 5, y: 2 });
  });
});