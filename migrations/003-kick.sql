-- Up

CREATE TABLE IF NOT EXISTS kickChannels (
  broadcasterUserId TEXT NOT NULL,
  guildId TEXT NOT NULL,
  notificationRoleId TEXT,
  notificationChannelId TEXT,
  PRIMARY KEY (broadcasterUserId, guildId)
);

-- Down

DROP TABLE kickChannels;