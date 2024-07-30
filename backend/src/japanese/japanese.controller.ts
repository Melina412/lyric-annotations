import kuromoji from 'kuromoji';
import { Request, Response } from 'express';
import { token } from 'morgan';

function tokenizeText(
  text: string
): Promise<{ surface: string; reading: string | null }[]> {
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({ dicPath: 'node_modules/kuromoji/dict' })
      .build((err, tokenizer) => {
        if (err) {
          return reject(err);
        }
        const path = tokenizer.tokenize(text);
        console.log('token example:', path);

        const tokens = path.map((token) => ({
          surface: token.surface_form,
          reading: token.reading ? token.reading : null,
          pronunciation: token.pronunciation ? token.pronunciation : null,
        }));
        resolve(tokens);
      });
  });
}

export async function addKana(req: Request, res: Response) {
  const text = req.body.textInput;

  try {
    const tokens = await tokenizeText(text);
    console.log('tokens', tokens);

    res.status(200).json({ success: true, tokens: tokens });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/*
word_id: 509800, // word ID in the dictionary
word_type: 'KNOWN', // word type (KNOWN if the word is registered in the dictionary, UNKNOWN if it is unknown)
word_position: 1, // start position of the word
surface_form: 'black characters', // surface form
pos: 'noun', // part of speech
pos_detail_1: 'general', // part of speech subdivision 1
pos_detail_2: '*', // part of speech subdivision 2
pos_detail_3: '*', // part of speech subdivision 3
conjugated_type: '*', // conjugated type
conjugated_form: '*', // conjugated form
basic_form: 'black characters', // basic form
reading: 'kuromoji', // reading
pronunciation: 'kuromoji' // pronunciation
*/
