import type { BotModule, BotCommand } from '../types';
import { core } from './core/core';
import { fun } from './fun/fun';
import{ kick } from './kick/kick';
import { users } from './users/users';
import { logs } from './logs/logs';
import { commands as commandsModule } from './commands/commands';
import { weather } from './weather/weather';
import { twitch } from './twitch/twitch';
import { spotify } from './spotify/spotify';
import { youTube } from './youtube/youtube';

export const modules = new Map<string, BotModule>([
  [core.slug,           core],
  [fun.slug,            fun],
  [kick.slug,           kick],
  [users.slug,          users],
  [logs.slug,           logs],
  [commandsModule.slug, commandsModule],
  [weather.slug,        weather],
  [twitch.slug,         twitch],
  [spotify.slug,        spotify],
  [youTube.slug,        youTube],
]);

export const commands = new Map<string, BotCommand>();
modules.forEach(module => {
  module.commands.forEach((command, commandName) => {
    commands.set(commandName, command);
  });
});