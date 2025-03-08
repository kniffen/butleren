import express from 'express';
import path from 'node:path';
import { logInfo } from './logger/logger';
import { PORT } from './constants';
import './database/database';
import './discord/client';

const app = express();

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.listen(PORT, () => {
  logInfo('Express', `Server is running on http://localhost:${PORT}`);
});
