import path from 'node:path';
import express from 'express';
import bodyParser from 'body-parser';
import { logInfo } from './modules/logs/logger';
import { PORT } from './constants';
import { database, initDatabase } from './database/database';
import { discordClient } from './discord/client';
import { discordRouter } from './discord/api/router';
import { searchRouter } from './search/api/searchRouter';
import { errorHandler } from './middleware/errorHandler';
import { modules } from './modules/modules';

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/discord', discordRouter);
app.use('/api/search',  searchRouter);

for (const [slug, mod] of modules) {
  if (!mod.router) {
    continue;
  }

  switch (slug) {
    case 'core': {
      app.use('/api/modules', mod.router);
    }
    default: {
      app.use(`/api/${slug}`, mod.router);
    }
  }
}

app.use(errorHandler);

(async function init(): Promise<void> {
  await initDatabase();
  await discordClient.login(process.env.DISCORD_TOKEN);

  app.listen(PORT, () => {
    logInfo('Express', `Server is running on http://localhost:${PORT}`);
  });

  setInterval(async () => {
    const date = new Date();
    if (0 !== date.getSeconds()) {
      return;
    }

    const db     = await database;
    const data   = await db.all('SELECT id FROM guilds');
    const guilds = await Promise.all(data.map(({ id }) => discordClient.guilds.fetch(id)));

    for (const [,mod] of modules) {
      mod.onInterval?.(date, guilds);
    }
  }, 1_000);
})();


