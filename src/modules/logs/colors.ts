import { KICK_GREEN } from '../kick/constants';
import { SPOTIFY_GREEN } from '../spotify/constants';
import { TWITCH_PURPLE } from '../twitch/constants';
import { YOUTUBE_COLOR } from '../youtube/constants';

export const hexToRGB = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
};

const rgbToAnsi = (r: number, g: number, b: number): string => {
  return `\x1b[38;2;${r};${g};${b}m`;
};

export const colors: Record<string, string> = {
  reset:    '\x1b[0m',
  yellow:   '\x1b[33m',
  // Services
  Database: rgbToAnsi(...hexToRGB('#FFFFC5')), // Light yellow
  Discord:  rgbToAnsi(...hexToRGB('#7289DA')), // Discord blue
  Modules:  rgbToAnsi(...hexToRGB('#19D8B4')), // Butleren turquoise
  Kick:     rgbToAnsi(...hexToRGB(KICK_GREEN)),
  Twitch:   rgbToAnsi(...hexToRGB(TWITCH_PURPLE)),
  Spotify:  rgbToAnsi(...hexToRGB(SPOTIFY_GREEN)),
  YouTube:  rgbToAnsi(...hexToRGB(YOUTUBE_COLOR)),
};