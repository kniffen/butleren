import type { ChannelType, ChatInputCommandInteraction, Guild } from 'discord.js';
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import { z } from 'zod';
import { schemas } from '@kniffen/butleren-api-specification';
import { Router } from 'express';

type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

/**
 * API types
 */

// Discord
export type GuildResponseBody = RemoveIndexSignature<z.infer<typeof schemas.Guild>>;
export type GuildSettings     = RemoveIndexSignature<z.infer<typeof schemas.GuildSettings>>;
export type GuildDBEntry      = RemoveIndexSignature<z.infer<typeof schemas.GuildDBEntry>>;

// Users
export type User        = RemoveIndexSignature<z.infer<typeof schemas.User>>;
export type UserDBEntry = RemoveIndexSignature<z.infer<typeof schemas.UserDBEntry>>;

// Logs
export type LogEntry = RemoveIndexSignature<z.infer<typeof schemas.LogEntry>>;

// Search
export type SearchResult = RemoveIndexSignature<z.infer<typeof schemas.SearchResult>>;

// Modules
export type Module         = RemoveIndexSignature<z.infer<typeof schemas.Module>>;
export type ModuleDBEntry  = RemoveIndexSignature<z.infer<typeof schemas.ModuleDBEntry>>;
export type ModuleSettings = RemoveIndexSignature<z.infer<typeof schemas.ModuleSettings>>;

// Commands
export type Command         = RemoveIndexSignature<z.infer<typeof schemas.Command>>;
export type CommandDBEntry  = RemoveIndexSignature<z.infer<typeof schemas.CommandDBEntry>>;
export type CommandSettings = RemoveIndexSignature<z.infer<typeof schemas.CommandSettings>>;

// Kick
export type KickChannel        = RemoveIndexSignature<z.infer<typeof schemas.KickChannel>>;
export type KickChannelDBEntry = RemoveIndexSignature<z.infer<typeof schemas.KickChannelDBEntry>>;

// Twitch
export type TwitchChannel            = RemoveIndexSignature<z.infer<typeof schemas.TwitchChannel>>;
export type TwitchChannelDBEntry     = RemoveIndexSignature<z.infer<typeof schemas.TwitchChannelDBEntry>>;
export type TwitchNotificationConfig = RemoveIndexSignature<z.infer<typeof schemas.TwitchNotificationConfig>>;

// YouTube
export type YouTubeChannel            = RemoveIndexSignature<z.infer<typeof schemas.YouTubeChannel>>;
export type YouTubeChannelDBEntry     = RemoveIndexSignature<z.infer<typeof schemas.YouTubeChannelDBEntry>>;
export type YouTubeNotificationConfig = RemoveIndexSignature<z.infer<typeof schemas.YouTubeNotificationConfig>>;

// Spotify
export type SpotifyShow               = RemoveIndexSignature<z.infer<typeof schemas.SpotifyShow>>;
export type SpotifyShowDBEntry        = RemoveIndexSignature<z.infer<typeof schemas.SpotifyShowDBEntry>>;
export type SpotifyNotificationConfig = RemoveIndexSignature<z.infer<typeof schemas.SpotifyNotificationConfig>>;

export interface BotCommand {
  isLocked: boolean;
  slashCommandBuilder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (commandInteraction: ChatInputCommandInteraction) => Promise<void>;
  defaultSettings: CommandSettings;
  parentSlug: string;
}

export interface BotModule {
  slug: string;
  name: string;
  description: string;
  allowedChannelTypes: ChannelType[];
  isLocked: boolean;
  commands: Map<string, BotCommand>;
  onInterval?: (date: Date, guilds: Guild[]) => Promise<void>,
  router?: Router,
  defaultSettings: ModuleSettings;
}