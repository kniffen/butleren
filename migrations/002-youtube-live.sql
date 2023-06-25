-- Up

CREATE TABLE IF NOT EXISTS youtubeLiveChannels (
  id TEXT NOT NULL,
  guildId TEXT NOT NULL,
  notificationRoleId TEXT,
  notificationChannelId TEXT,
  PRIMARY KEY (id, guildId)
);

-- Down

DROP TABLE youtubeLiveChannels;