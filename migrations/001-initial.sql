-- Up

CREATE TABLE IF NOT EXISTS guilds (
  id TEXT NOT NULL,
  color TEXT DEFAULT "#19D8B4",
  nickname TEXT,
  timezone TEXT DEFAULT "UTC",
  PRIMARY KEY(id)
);

-- Down

DROP TABLE guilds;
