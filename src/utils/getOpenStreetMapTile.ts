import fetch from 'node-fetch';
import { Image, loadImage } from 'canvas';
import { logError } from '../modules/logs/logger';

export const getOpenStreetMapTile = async function(x: number, y: number, zoom: number): Promise<Image | null> {
  const tileUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

  try {
    const res = await fetch(tileUrl);
    if (!res.ok) {
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const img = await loadImage(buffer);
    return img;

  } catch (err) {
    logError('OpenStreetMap', 'Tile fetch failed', { tileUrl, err });
    return null;
  }
};