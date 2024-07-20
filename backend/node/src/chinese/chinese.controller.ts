import { Request, Response } from 'express';
import pinyin4js from 'pinyin4js';
import { splitText, splitPinyin } from './chinese.utils';
import { readFile, writeFile, stat, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const sharedPath = path.join(__dirname, '../../shared');
const outputPath = path.join(sharedPath, '/output.json');
const inputPath = path.join(sharedPath, '/input.json');

// ---------------------------------------------------------------

async function waitForFile(filePath: string, timeout = 5000) {
  const start = Date.now();
  while (!existsSync(filePath)) {
    if (Date.now() - start >= timeout) {
      throw new Error(`File ${filePath} not created within timeout`);
    }
    await new Promise((resolve) => {
      console.log('waiting for file...');
      setTimeout(resolve, 100);
    });
  }
}

async function watchPythonOutput(res: Response) {
  try {
    await waitForFile(outputPath, 10000);

    const data = await readFile(outputPath, 'utf-8');

    const segments: {
      hanzi_seg: string[];
      pinyin_seg: string[];
    } = JSON.parse(data);

    const splittedHanzi = segments?.hanzi_seg;
    const splittedPinyin = segments?.pinyin_seg;

    let result: { hanzi: string; pinyin: string }[] = [];

    for (let i = 0; i < splittedHanzi?.length; i++) {
      result.push({
        hanzi: splittedHanzi[i],
        pinyin: splittedPinyin[i],
      });
    }

    result = result?.map((element: { hanzi: string; pinyin: string }) => {
      return {
        hanzi: [element.hanzi].join(''),
        pinyin: [element.pinyin].join(''),
      };
    });

    console.log('result', result);

    res.status(201).json({
      success: true,
      message: '[python] pinyin conversion successful',
      annotations: result,
      title: res.locals.title,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function addPinyin(req: Request, res: Response) {
  console.log('req.body:', req.body);
  const text = req.body.textInput;
  const title = req.body.titleInput;
  res.locals.title = title; // locals = local scope storage in express used to pass data between middleware
  const processingLogic: 'full text' | 'hanzi' = 'full text';

  if (processingLogic === 'full text') {
    console.log('processing full text');

    try {
      // delete existing outdated files
      if (existsSync(inputPath)) await unlink(inputPath).catch(() => {});
      if (existsSync(outputPath)) await unlink(outputPath).catch(() => {});

      if (text) {
        await writeFile(inputPath, JSON.stringify({ text }), 'utf-8');
        watchPythonOutput(res);
      } else {
        res.status(400).json({
          success: false,
          message: 'No text input provided',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else if (processingLogic === 'hanzi') {
    console.log('processing hanzi');
    //# old code with js logic text processing ----------------------

    try {
      if (text) {
        const splittedHanzi = splitText(text);
        console.log({ splittedHanzi });
        console.log('splittedHanzi length', splittedHanzi.length);

        const pinyinString = pinyin4js.convertToPinyinString(
          text,
          '-',
          pinyin4js.WITH_TONE_MARK
        );
        console.log({ pinyinString });
        const splittedPinyin = splitPinyin(pinyinString);

        console.log({ splittedPinyin });
        console.log('splittedPinyin length', splittedPinyin.length);
        if (splittedHanzi.length !== splittedPinyin.length) {
          console.log(
            'hanzi:',
            splittedHanzi.length,
            'pinyin:',
            splittedPinyin.length
          );
          throw new Error('Hanzi and Pinyin lengths do not match');
        }

        // result als array speichern damit die reihenflge beibehalten (wird im gegensatz zu objekt)
        const result: { hanzi: string; pinyin: string }[] = [];

        for (let i = 0; i < splittedHanzi.length; i++) {
          result.push({ hanzi: splittedHanzi[i], pinyin: splittedPinyin[i] });
        }

        console.log(result);
        res.status(201).json({
          success: true,
          message: 'hello from server',
          annotations: result,
          title: title,
        });
      } else {
        res
          .status(400)
          .json({ success: false, message: 'Text input is required' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
