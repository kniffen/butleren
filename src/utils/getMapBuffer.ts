import { PassThrough } from 'node:stream';
import { make, encodePNGToStream } from 'pureimage';
import { latLonToTile } from './latLonToTile';
import { getOpenStreetMapTile } from './getOpenStreetMapTile';

export const getMapBuffer = async function(lat: number, lon: number, zoom = 10, width = 256, height = 256): Promise<Buffer> {
  const tileSize = 256;
  const { x, y } = latLonToTile(lat, lon, zoom);

  const tilesX = Math.ceil(width / tileSize) + 2;
  const tilesY = Math.ceil(height / tileSize) + 2;
  const startX = x - Math.floor(tilesX / 2);
  const startY = y - Math.floor(tilesY / 2);

  const bitmap = make(tilesX * tileSize, tilesY * tileSize);
  const ctx = bitmap.getContext('2d');

  for (let dx = 0; dx < tilesX; dx++) {
    for (let dy = 0; dy < tilesY; dy++) {
      // eslint-disable-next-line no-await-in-loop
      const tile = await getOpenStreetMapTile(startX + dx, startY + dy, zoom);
      if (tile) {
        ctx.drawImage(tile, dx * tileSize, dy * tileSize);
      }
    }
  }

  const worldSize = tileSize * Math.pow(2, zoom);
  const lonNorm = (lon + 180) / 360;
  const latRad = (lat * Math.PI) / 180;
  const latNorm = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2;

  const pixelX = lonNorm * worldSize - startX * tileSize;
  const pixelY = latNorm * worldSize - startY * tileSize;

  const cropX = Math.round(pixelX - width / 2);
  const cropY = Math.round(pixelY - height / 2);

  const outBitmap = make(width, height);
  const outCtx = outBitmap.getContext('2d');
  outCtx.drawImage(bitmap, -cropX, -cropY);

  const passThroughStream = new PassThrough();
  const pngData = [];
  passThroughStream.on('data', (chunk) => pngData.push(chunk));
  passThroughStream.on('end', () => {});

  return new Promise<Buffer>((resolve, reject) => {
    const passThroughStream = new PassThrough();
    const pngData: Buffer[] = [];

    passThroughStream.on('data', (chunk: Buffer) => pngData.push(chunk));
    passThroughStream.on('end', () => { resolve(Buffer.concat(pngData)); });
    passThroughStream.on('error', reject);

    encodePNGToStream(outBitmap, passThroughStream).catch(reject);
  });
};
