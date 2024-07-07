import { Request, Response } from 'express';
import pinyin4js from 'pinyin4js';
import { splitText, splitPinyin } from './chinese.utils';

export async function addPinyin(req: Request, res: Response) {
  console.log('req.body:', req.body);
  const text = req.body.textInput;
  const title = req.body.titleInput;

  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
