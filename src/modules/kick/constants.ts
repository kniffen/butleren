export const KICK_CLIENT_ID = process.env.KICK_CLIENT_ID!;
export const KICK_CLIENT_SECRET = process.env.KICK_CLIENT_SECRET!;
export const KICK_GREEN = '#53FC18';
export const KICK_URL = 'https://kick.com';
export const KICK_API_URLS = {
  TOKEN:        'https://id.kick.com/oauth/token',
  CHANNELS:     'https://api.kick.com/public/v1/channels',
  LIVE_STREAMS: 'https://api.kick.com/public/v1/livestreams',
} as const;
export const KICK_CHANNELS_TABLE_NAME = 'kickChannels';