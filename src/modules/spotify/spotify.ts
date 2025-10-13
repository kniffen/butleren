import { ChannelType } from 'discord.js';
import type { BotCommand, BotModule } from '../../types';
import { spotifyRouter } from './api/spotifyRouter';
import { onSpotifyInterval } from './interval/onSpotifyInterval';

const commands = new Map<string, BotCommand>([]);

export const spotify: BotModule = {
  slug:                'spotify',
  name:                'Spotify',
  description:         'Spotify integration',
  allowedChannelTypes: [ChannelType.GuildText],
  isLocked:            false,
  commands,
  router:              spotifyRouter,
  onInterval:          onSpotifyInterval,
  defaultSettings:     { isEnabled: false },
};