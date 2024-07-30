import express, { Request, Response } from 'express';
import { addKana } from './japanese.controller';

export const router = express.Router();

router.post('/', addKana);

router.get('/jisho/words', async (req: Request, res: Response) => {
  const query = req.query;

  // von hier aus den fetch an jisho machen
  const url = `https://jisho.org/api/v1/search/words?${new URLSearchParams(
    query as any
  ).toString()}`;

  try {
    // den user agent manuell setzen damit der nicht node fetch ist
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });
    if (response.ok) {
      const data = await response.json();
      // data an frontent schicken
      res.json(data);
    } else {
      throw new Error(`Error fetching data from Jisho: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data from Jisho' });
  }
});
