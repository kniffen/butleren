import { MIGRATIONS_PATH } from './src/database/constants';
import { database } from './src/database/database';

process.env.DISCORD_TOKEN = 'discord-token';
process.env.LOGS_PATH = 'logs';
process.env.OPEN_WEATHER_MAP_API_KEY = 'open-weather-map-api-key';
process.env.GOOGLE_API_KEY = 'GOOGLE_API_KEY';
process.env.TWITCH_CLIENT_ID = 'TWITCH_CLIENT_ID';
process.env.TWITCH_CLIENT_SECRET = 'TWITCH_CLIENT_SECRET';
process.env.SPOTIFY_CLIENT_ID = 'SPOTIFY_CLIENT_ID';
process.env.SPOTIFY_CLIENT_SECRET = 'SPOTIFY_CLIENT_SECRET';

jest.mock('node-fetch', () => {
  const fetch = jest.requireActual('node-fetch');
  const fetchMock = jest.fn();
  for (const key in fetch) {
    // @ts-ignore
    fetchMock[key] = fetch[key];
  }

  return fetchMock;
});

jest.mock('./src/modules/logs/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarn: jest.fn(),
  logDebug: jest.fn(),
}));

jest.mock('./src/database/database', () => {
  const sqlite3 = require('sqlite3');
  const { open } = require('sqlite');

  return {
    database: open({
      filename: ':memory:',
      driver: sqlite3.Database,
    }),
    initDatabase: jest.fn(),
  }
});

beforeAll(async () => {
  const db = await database;
  await db.migrate({ migrationsPath: MIGRATIONS_PATH });
});

beforeEach(async () => {
  const db = await database;
  await db.run('DELETE FROM guilds');
  await db.run('DELETE FROM modules');
  await db.run('DELETE FROM commands');
  await db.run('DELETE FROM users');
  await db.run('DELETE FROM kickChannels');
  await db.run('DELETE FROM youTubeChannels');
});