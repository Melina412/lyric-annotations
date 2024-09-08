//! in der package.json NICHT type module einstellen, sonst geht nodemon nicht

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import { addPinyin } from './src/chinese/chinese.controller';
// import { router as chineseRouter } from './src/chinese/chinese.router';
import { router as japaneseRouter } from './src/japanese/japanese.router';
import morgan from 'morgan';
import path from 'path';

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// app.use('/api/chinese', chineseRouter);
app.use('/api/japanese', japaneseRouter);

const PROJECT_ROOT = process.cwd();
console.log({ PROJECT_ROOT });

const FRONTEND_INDEX = path.join(__dirname, '../../frontend/dist/index.html');
const FRONTEND_DIR = path.join(__dirname, '../../frontend/dist');

const directory = __dirname;
console.log({ directory });
console.log({ FRONTEND_INDEX, FRONTEND_DIR });

app.use(express.static(FRONTEND_DIR));

app.get('*', (_, res) => {
  res.sendFile(FRONTEND_INDEX);
});

app.listen(PORT, () => {
  console.log('✅ express server on port', PORT);
});
