-- Up

CREATE TABLE IF NOT EXISTS guilds (
  id TEXT NOT NULL,
  color TEXT DEFAULT "#19D8B4",
  nickname TEXT,
  timezone TEXT DEFAULT "UTC",
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT NOT NULL,
  guildId TEXT NOT NULL,
  isEnabled INTEGER DEFAULT 0,
  PRIMARY KEY(id, guildId)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL,
  location TEXT,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS spotifyShows (
  id TEXT NOT NULL,
  guildId TEXT NOT NULL,
  latestEpisodeId TEXT,
  notificationChannelId TEXT NOT NULL,
  notificationRoleId TEXT,
  PRIMARY KEY(id, guildId)
);

CREATE TABLE IF NOT EXISTS twitterUsers (
  id TEXT NOT NULL,
  guildId TEXT NOT NULL,
  notificationChannelId TEXT NOT NULL,
  notificationRoleId TEXT,
  PRIMARY KEY(id, guildId)
);

CREATE TABLE IF NOT EXISTS youtubeChannels (
  id TEXT NOT NULL,
  guildId TEXT NOT NULL,
  notificationRoleId TEXT,
  notificationChannelId TEXT,
  PRIMARY KEY (id, guildId)
)

-- Down

DROP TABLE guilds;
DROP TABLE modules;
DROP TABLE users;
DROP TABLE spotifyShows;
DROP TABLE twitterUsers;
DROP TABLE youtubeChannels;