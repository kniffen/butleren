-- Up

CREATE TABLE IF NOT EXISTS guilds (
  guildId TEXT SERIAL PRIMARY KEY,
  settings JSON
);

CREATE TABLE IF NOT EXISTS users (
  userId TEXT SERIAL PRIMARY KEY,
  settings JSON
);

CREATE TABLE IF NOT EXISTS modules (
  slug TEXT NOT NULL,
  guildId TEXT NOT NULL,
  settings JSON,
  PRIMARY KEY(slug, guildId)
);

-- Down

DROP TABLE guilds;
DROP TABLE users;
DROP TABLE modules;