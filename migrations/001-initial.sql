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
  isEnabled INTEGER DEFAULT 1,
  PRIMARY KEY(id, guildId)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL,
  location TEXT,
  PRIMARY KEY(id)
);

-- Down

DROP TABLE guilds;
DROP TABLE modules;
DROP TABLE users;