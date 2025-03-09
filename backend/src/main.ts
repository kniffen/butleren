import path from 'node:path';
import express from 'express';
import bodyParser from 'body-parser';
import { logInfo } from './logger/logger';
import { PORT } from './constants';
import './database/database';
import './discord/client';
import { discordRouter } from './discord/api/router';

const app = express();

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/discord', discordRouter);

app.listen(PORT, () => {
  logInfo('Express', `Server is running on http://localhost:${PORT}`);
});
