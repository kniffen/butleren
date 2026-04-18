import { schemas } from '@repo/api-specification';
import { z } from 'zod';

export type Guild           = z.infer<typeof schemas.Guild>;
export type GuildSettings   = z.infer<typeof schemas.GuildSettings>;
export type Module          = z.infer<typeof schemas.Module>;
export type ModuleSettings  = z.infer<typeof schemas.ModuleSettings>;
export type Command         = z.infer<typeof schemas.Command>;
export type CommandSettings = z.infer<typeof schemas.CommandSettings>;
export type User            = z.infer<typeof schemas.User>;
export type LogEntry        = z.infer<typeof schemas.LogEntry>;
export type SearchResult    = z.infer<typeof schemas.SearchResult>;

// Kick
export type KickChannel            = z.infer<typeof schemas.KickChannel>;
export type KickNotificationConfig = z.infer<typeof schemas.KickNotificationConfig>;

// Twitch
export type TwitchChannel            = z.infer<typeof schemas.TwitchChannel>;
export type TwitchNotificationConfig = z.infer<typeof schemas.TwitchNotificationConfig>;

// YouTube
export type YouTubeChannel            = z.infer<typeof schemas.YouTubeChannel>;
export type YouTubeNotificationConfig = z.infer<typeof schemas.YouTubeNotificationConfig>;
