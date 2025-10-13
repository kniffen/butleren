import { Readable } from 'node:stream';
import fetch from 'node-fetch';
import { Bitmap, decodePNGFromStream } from 'pureimage';
import { logError } from '../modules/logs/logger';

export const getOpenStreetMapTile = async function(x: number, y: number, zoom: number): Promise<Bitmap | null> {
  const tileUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

  try {
    const res = await fetch(tileUrl);
    if (!res.ok) {
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const stream = Readable.from(buffer);
    const img = await decodePNGFromStream(stream);
    return img;

  } catch (err) {
    logError('OpenStreetMap', 'Tile fetch failed', { tileUrl, err });
    return null;
  }
};