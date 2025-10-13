import fetch, { Response } from 'node-fetch';
import { getOpenStreetMapTile } from './getOpenStreetMapTile';
import { loadImage } from 'canvas';

jest.mock('canvas', ()=> {
  const originalModule = jest.requireActual('canvas');
  return {
    ...originalModule,
    loadImage: jest.fn(async () => 'foo'),
  };
});

describe('getOpenStreetMapTile()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
  const loadImageMock = loadImage as jest.MockedFunction<typeof loadImage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should return a map tile image for valid coordinates', async () => {
    const imageArrayBuffer = Buffer.from([137, 80, 78, 71]); // PNG file signature
    fetchMock.mockResolvedValue({
      ok:          true,
      arrayBuffer: async () => imageArrayBuffer,
    } as unknown as Response);

    const tile = await getOpenStreetMapTile(100, 200, 1);

    expect(fetchMock).toHaveBeenCalledWith('https://tile.openstreetmap.org/1/100/200.png');
    expect(loadImageMock).toHaveBeenCalledWith(Buffer.from(imageArrayBuffer));
    expect(tile).toEqual('foo');
  });

  test('It should return null if the tile does not exist', async () => {
    fetchMock.mockResolvedValue({ ok: false } as unknown as Response);

    const tile = await getOpenStreetMapTile(100, 200, 1);
    expect(loadImageMock).not.toHaveBeenCalled();
    expect(tile).toBeNull();
  });
});