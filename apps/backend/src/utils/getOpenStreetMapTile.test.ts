import { Readable } from 'node:stream';
import fetch, { Response } from 'node-fetch';
import { getOpenStreetMapTile } from './getOpenStreetMapTile';
import { decodePNGFromStream } from 'pureimage';

jest.mock('pureimage', ()=> {
  const originalModule = jest.requireActual('pureimage');
  return {
    ...originalModule,
    decodePNGFromStream: jest.fn(async () => 'foo'),
  };
});

describe('getOpenStreetMapTile()', () => {
  const fetchMock = fetch as jest.MockedFunction<typeof fetch>;
  const decodePNGFromStreamMock = decodePNGFromStream as jest.MockedFunction<typeof decodePNGFromStream>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('It should return a map tile image for valid coordinates', async () => {
    const imageBuffer = Buffer.from([137, 80, 78, 71]); // PNG file signature
    fetchMock.mockResolvedValue({
      ok:          true,
      arrayBuffer: async () => imageBuffer.buffer.slice(imageBuffer.byteOffset, imageBuffer.byteOffset + imageBuffer.byteLength),
    } as unknown as Response);

    const tile = await getOpenStreetMapTile(100, 200, 1);

    expect(fetchMock).toHaveBeenCalledWith('https://tile.openstreetmap.org/1/100/200.png');
    expect(decodePNGFromStreamMock).toHaveBeenCalledWith(expect.any(Readable));
    expect(tile).toEqual('foo');
  });

  test('It should return null if the tile does not exist', async () => {
    fetchMock.mockResolvedValue({ ok: false } as unknown as Response);

    const tile = await getOpenStreetMapTile(100, 200, 1);
    expect(decodePNGFromStreamMock).not.toHaveBeenCalled();
    expect(tile).toBeNull();
  });
});