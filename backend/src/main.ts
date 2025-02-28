import express from 'express';
import path from 'node:path';
import { PORT } from './constants';

const app = express();

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});