//! in der package.json NICHT type module einstellen, sonst geht nodemon nicht

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { addPinyin } from './src/chinese/chinese.controller';
import { router as chineseRouter } from './src/chinese/chinese.router';
import { router as japaneseRouter } from './src/japanese/japanese.router';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/chinese', chineseRouter);
app.use('/api/japanese', japaneseRouter);

app.listen(PORT, () => {
  console.log('✅ express server on port', PORT);
});
