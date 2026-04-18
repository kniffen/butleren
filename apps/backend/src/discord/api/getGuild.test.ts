import type { Request, Response } from 'express';
import { ChannelType, Collection, Guild, NonThreadGuildBasedChannel, Role } from 'discord.js';
import { getGuild } from './getGuild';
import { discordClient } from '../client';
import * as getGuildSettings from '../database/getGuildSettings';
import { defaultGuildSettings } from '../../utils/addGuildToDatabase';

jest.mock('../client', () => ({
  discordClient: {
    guilds: {
      fetch: jest.fn(),
    },
  }
}));

describe('getGuild()', () => {
  const getGuildSettingsMock = jest.spyOn(getGuildSettings, 'getGuildSettings').mockResolvedValue({ color: 'red', nickname: 'Foo' });
  const fetchGuildMock = jest.spyOn(discordClient.guilds, 'fetch');
  const nextSpy = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('It should get a guild and its settings', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    const request = { params: { 'guild': guildId } } as unknown as Request;
    await getGuild(request, response, nextSpy);
    expect(response.json).toHaveBeenCalledWith({
      id:       '12345',
      name:     'Test Guild',
      iconURL:  'https://example.com/icon.png',
      settings: {
        color:    'red',
        nickname: 'Foo',
      },
      channels: [
        { id: '11111', name: 'general', type: 'TEXT' },
        { id: '22222', name: 'voice',   type: 'VOICE' },
      ],
      roles: [
        { id: 'r11111', name: 'Admin'     },
        { id: 'r22222', name: 'Moderator' },
      ],
    });
  });

  test('It should provide default settings if the is missing them', async () => {
    getGuildSettingsMock.mockResolvedValueOnce(null);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetchGuildMock.mockResolvedValue(guild);

    const request = { params: { 'guild': guildId } } as unknown as Request;
    await getGuild(request, response, nextSpy);
    expect(response.json).toHaveBeenCalledWith({
      id:       '12345',
      name:     'Test Guild',
      iconURL:  'https://example.com/icon.png',
      channels: [
        { id: '11111', name: 'general', type: 'TEXT' },
        { id: '22222', name: 'voice',   type: 'VOICE' },
      ],
      roles: [
        { id: 'r11111', name: 'Admin'     },
        { id: 'r22222', name: 'Moderator' },
      ],
      settings: defaultGuildSettings,
    });
  });
});

const channels = new Collection<string, NonThreadGuildBasedChannel | null>([
  ['11111', { id: '11111', name: 'general', type: ChannelType.GuildText  } as unknown as NonThreadGuildBasedChannel],
  ['22222', { id: '22222', name: 'voice',   type: ChannelType.GuildVoice } as unknown as NonThreadGuildBasedChannel],
  ['33333', null],
]);

const roles = new Collection<string, Role>([
  ['r11111', { id: 'r11111', name: 'Admin'     } as unknown as Role],
  ['r22222', { id: 'r22222', name: 'Moderator' } as unknown as Role],
]);

const guild = {
  id:       '12345',
  name:     'Test Guild',
  iconURL:  () => 'https://example.com/icon.png',
  settings: { color: 'red', timezone: 'UTC' },
  channels: { fetch: jest.fn().mockResolvedValue(channels) },
  roles:    { fetch: jest.fn().mockResolvedValue(roles) }
} as unknown as Guild;

const guildId = '12345';

const response = {
  status:     jest.fn(() => response),
  json:       jest.fn(),
  sendStatus: jest.fn(),
} as unknown as Response;