-- Up

CREATE TABLE IF NOT EXISTS guilds (
  id TEXT NOT NULL,
  color TEXT DEFAULT "#19D8B4",
  nickname TEXT,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL,
  lat FLOAT,
  lon FLOAT,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS modules (
  slug TEXT NOT NULL,
  guildId TEXT NOT NULL,
  isEnabled INTEGER DEFAULT 0,
  PRIMARY KEY(slug, guildId)
);

CREATE TABLE IF NOT EXISTS commands (
  slug TEXT NOT NULL,
  guildId TEXT NOT NULL,
  isEnabled INTEGER DEFAULT 0,
  PRIMARY KEY(slug, guildId)
);

CREATE TABLE IF NOT EXISTS kickChannels (
  broadcasterUserId INTEGER NOT NULL,
  guildId TEXT NOT NULL,
  notificationRoleId TEXT,
  notificationChannelId TEXT,
  PRIMARY KEY (broadcasterUserId, guildId)
);

CREATE TABLE IF NOT EXISTS twitchChannels (
  id TEXT NOT NULL,
  guildId TEXT NOT NULL,
  notificationRoleId TEXT,
  notificationChannelId TEXT,
  PRIMARY KEY (id, guildId)
);

CREATE TABLE IF NOT EXISTS spotifyShows (
  showId TEXT NOT NULL,
  guildId TEXT NOT NULL,
  notificationRoleId TEXT,
  notificationChannelId TEXT,
  PRIMARY KEY (showId, guildId)
);

CREATE TABLE IF NOT EXISTS youTubeChannels (
  channelId TEXT NOT NULL,
  guildId TEXT NOT NULL,
  includeLiveStreams INTEGER DEFAULT 0,
  notificationChannelId TEXT,
  notificationRoleId TEXT,
  liveNotificationRoleId TEXT,
  PRIMARY KEY(channelId, guildId)
);


-- Down

DROP TABLE guilds;
DROP TABLE users;
DROP TABLE modules;
DROP TABLE commands;
DROP TABLE kickChannels;
DROP TABLE twitchChannels;
DROP TABLE spotifyShows;
DROP TABLE youTubeChannels;