import  type { Request, Response } from 'express';
import { getGuilds } from './getGuilds';
import { database } from '../../database/database';
import { discordClient } from '../client';
import { Collection, type Guild, type OAuth2Guild } from 'discord.js';
import { defaultGuildSettings } from '../../utils/addGuildToDatabase';

jest.mock('../client', () => ({
  discordClient: {
    guilds: {
      cache: {
        get: jest.fn(),
      },
      fetch: jest.fn(),
    },
  },
}));

describe('getGuilds()', () => {
  const fetchGuildsMock = jest.spyOn(discordClient.guilds, 'fetch');
  const nextSpy = jest.fn();

  jest
    .spyOn(discordClient.guilds.cache, 'get')
    .mockImplementation((id: string) => guilds.get(id) as unknown as Guild);

  beforeEach(async () => {
    jest.clearAllMocks();

    const db = await database;
    await db.run(
      'INSERT INTO guilds (id, color, nickname) VALUES (?, ?, ?)',
      guildId,
      'red',
      'Test nick',
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get all guilds and their settings', async () => {
    fetchGuildsMock.mockResolvedValue(guilds);

    await getGuilds(request, response, nextSpy);
    expect(response.json).toHaveBeenCalledWith([
      {
        id:       '12345',
        name:     'Test Guild',
        iconURL:  'https://example.com/icon.png',
        settings: {
          color:    'red',
          nickname: 'Test nick',
        },
      },
      {
        id:       '67890',
        name:     'Another Guild',
        iconURL:  'https://example.com/another-icon.png',
        settings: defaultGuildSettings
      },
    ]);
  });
});

const guildId = '12345';
const guilds = new Collection<string, OAuth2Guild>([
  [
    guildId,
    {
      id:      '12345',
      name:    'Test Guild',
      iconURL: () => 'https://example.com/icon.png',
    } as OAuth2Guild,
  ],
  [
    '67890',
    {
      id:      '67890',
      name:    'Another Guild',
      iconURL: () => 'https://example.com/another-icon.png',
    } as OAuth2Guild,
  ]
]);

const request = {} as Request;

const response = {
  status:     jest.fn(() => response),
  sendStatus: jest.fn(),
  json:       jest.fn(),
} as unknown as Response;