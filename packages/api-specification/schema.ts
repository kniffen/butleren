import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const GuildSettings = z
  .object({ nickname: z.string().nullable(), color: z.string() })
  .strict()
  .passthrough();
const Guild = z
  .object({
    id: z.string(),
    name: z.string(),
    iconURL: z.string().nullable(),
    settings: GuildSettings,
    channels: z
      .array(
        z
          .object({
            id: z.string(),
            name: z.string(),
            type: z.enum(["ANNOUNCEMENT", "TEXT", "VOICE", "CATEGORY"]),
          })
          .partial()
          .strict()
          .passthrough()
      )
      .optional(),
    roles: z
      .array(
        z
          .object({ id: z.string(), name: z.string() })
          .partial()
          .strict()
          .passthrough()
      )
      .optional(),
  })
  .strict()
  .passthrough();
const _0 = z
  .object({ lat: z.number().nullable(), lon: z.number().nullable() })
  .strict()
  .passthrough();
const User = z
  .object({ id: z.string(), displayName: z.string(), settings: _0 })
  .strict()
  .passthrough();
const LogEntry = z
  .object({
    id: z.string(),
    timestamp: z.string().datetime({ offset: true }),
    level: z.enum(["info", "warn", "error", "debug"]),
    service: z.string().optional(),
    message: z.string(),
    rest: z.array(z.string()).optional(),
  })
  .strict()
  .passthrough();
const SearchResult = z
  .object({ id: z.string(), name: z.string(), imageURL: z.string() })
  .strict()
  .passthrough();
const ModuleSettings = z
  .object({ isEnabled: z.boolean() })
  .strict()
  .passthrough();
const Module = z
  .object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    isLocked: z.boolean(),
    settings: ModuleSettings,
  })
  .strict()
  .passthrough();
const Command = z
  .object({
    slug: z.string(),
    description: z.string(),
    isLocked: z.boolean(),
    isEnabled: z.boolean(),
  })
  .strict()
  .passthrough();
const CommandSettings = z
  .object({ isEnabled: z.boolean() })
  .strict()
  .passthrough();
const TwitchNotificationConfig = z
  .object({
    id: z.string().min(1),
    notificationChannelId: z.string(),
    notificationRoleId: z.string().nullable(),
  })
  .strict()
  .passthrough();
const TwitchChannel = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    url: z.string(),
    notificationConfig: TwitchNotificationConfig,
  })
  .strict()
  .passthrough();
const KickNotificationConfig = z
  .object({
    broadcasterUserId: z.number().gte(1),
    notificationChannelId: z.string(),
    notificationRoleId: z.string().nullable(),
  })
  .strict()
  .passthrough();
const KickChannel = z
  .object({
    broadcasterUserId: z.number(),
    name: z.string(),
    description: z.string().optional(),
    url: z.string(),
    notificationConfig: KickNotificationConfig,
  })
  .strict()
  .passthrough();
const YouTubeNotificationConfig = z
  .object({
    channelId: z.string().min(1),
    includeLiveStreams: z.boolean().default(false),
    notificationChannelId: z.string(),
    notificationRoleId: z.string().nullable(),
    liveNotificationRoleId: z.string().nullable(),
  })
  .strict()
  .passthrough();
const YouTubeChannel = z
  .object({
    channelId: z.string(),
    name: z.string(),
    notificationConfig: YouTubeNotificationConfig,
  })
  .strict()
  .passthrough();
const GuildDBEntry = GuildSettings.and(
  z.object({ id: z.string() }).strict().passthrough()
);
const ChatRequestBody = z
  .object({ message: z.string() })
  .strict()
  .passthrough();
const UserDBEntry = z
  .object({ lat: z.number().nullable(), lon: z.number().nullable() })
  .strict()
  .passthrough()
  .and(z.object({ id: z.string() }).strict().passthrough());
const ModuleDBEntry = z
  .object({
    guildId: z.string(),
    slug: z.string(),
    isEnabled: z.union([z.literal(0), z.literal(1)]),
  })
  .strict()
  .passthrough();
const CommandDBEntry = z
  .object({
    guildId: z.string(),
    slug: z.string(),
    isEnabled: z.union([z.literal(0), z.literal(1)]),
  })
  .strict()
  .passthrough();
const id = z.string();
const TwitchChannelDBEntry = TwitchNotificationConfig.and(
  z.object({ guildId: id }).strict().passthrough()
);
const KickChannelDBEntry = KickNotificationConfig.and(
  z.object({ guildId: id }).strict().passthrough()
);
const YouTubeChannelDBEntry = z
  .object({
    channelId: z.string(),
    guildId: id,
    includeLiveStreams: z.union([z.literal(0), z.literal(1)]),
    notificationChannelId: z.string(),
    notificationRoleId: z.string().nullable(),
    liveNotificationRoleId: z.string().nullable(),
  })
  .strict()
  .passthrough();

export const schemas = {
  GuildSettings,
  Guild,
  _0,
  User,
  LogEntry,
  SearchResult,
  ModuleSettings,
  Module,
  Command,
  CommandSettings,
  TwitchNotificationConfig,
  TwitchChannel,
  KickNotificationConfig,
  KickChannel,
  YouTubeNotificationConfig,
  YouTubeChannel,
  GuildDBEntry,
  ChatRequestBody,
  UserDBEntry,
  ModuleDBEntry,
  CommandDBEntry,
  id,
  TwitchChannelDBEntry,
  KickChannelDBEntry,
  YouTubeChannelDBEntry,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/commands/:guildId",
    alias: "getApicommandsGuildId",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(Command),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/commands/:name/:guildId",
    alias: "putApicommandsNameGuildId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ isEnabled: z.boolean() }).strict().passthrough(),
      },
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "name",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Command not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/commands/:name/:guildId/restore",
    alias: "postApicommandsNameGuildIdrestore",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "name",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Command not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/discord/guilds",
    alias: "getApidiscordguilds",
    requestFormat: "json",
    response: z.array(Guild),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/discord/guilds/:guildId",
    alias: "getApidiscordguildsGuildId",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: Guild,
    errors: [
      {
        status: 404,
        description: `Guild not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/discord/guilds/:guildId",
    alias: "putApidiscordguildsGuildId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: GuildSettings,
      },
      {
        name: "guild",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Guild not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/kick/:guildId/channels",
    alias: "getApikickGuildIdchannels",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(KickChannel),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/kick/:guildId/channels",
    alias: "postApikickGuildIdchannels",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: KickNotificationConfig,
      },
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Channel not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/kick/:guildId/channels/:broadcasterUserId",
    alias: "deleteApikickGuildIdchannelsBroadcasterUserId",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "broadcasterUserId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Channel not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/logs",
    alias: "getApilogs",
    requestFormat: "json",
    parameters: [
      {
        name: "date",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.array(LogEntry),
  },
  {
    method: "get",
    path: "/api/modules/:guildId",
    alias: "getApimodulesGuildId",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(Module),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/modules/:slug/:guildId",
    alias: "putApimodulesSlugGuildId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ isEnabled: z.boolean() }).strict().passthrough(),
      },
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "slug",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Module not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/search/:service",
    alias: "getApisearchService",
    requestFormat: "json",
    parameters: [
      {
        name: "service",
        type: "Path",
        schema: z.enum(["youtube", "kick", "twitch"]),
      },
      {
        name: "query",
        type: "Query",
        schema: z.string(),
      },
    ],
    response: z.array(SearchResult),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/twitch/:guildId/channels",
    alias: "getApitwitchGuildIdchannels",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(TwitchChannel),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/twitch/:guildId/channels",
    alias: "postApitwitchGuildIdchannels",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: TwitchNotificationConfig,
      },
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Channel not found&#x27;`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/twitch/:guildId/channels/:channelId",
    alias: "deleteApitwitchGuildIdchannelsChannelId",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "channelId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Channel not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/users",
    alias: "getApiusers",
    requestFormat: "json",
    response: z.array(User),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/youtube/:guildId/channels",
    alias: "getApiyoutubeGuildIdchannels",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.array(YouTubeChannel),
    errors: [
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/youtube/:guildId/channels",
    alias: "postApiyoutubeGuildIdchannels",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: YouTubeNotificationConfig,
      },
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Channel not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/youtube/:guildId/channels/:channelId",
    alias: "deleteApiyoutubeGuildIdchannelsChannelId",
    requestFormat: "json",
    parameters: [
      {
        name: "guildId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "channelId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Channel not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal server error`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
