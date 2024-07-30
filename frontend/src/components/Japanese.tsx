import { useState, useEffect } from 'react';
import type { LanguageComponentProps } from '../types';
import * as wanakana from 'wanakana';

//! WANAKANA KANN KEINE KANJI IN KANA ODER ROMAJI KONVERTIEREN
//! KRUOMOJI FUNKTIONIERT NUR IN NODE

function Japanese({
  setLanguage,
  annotations,
  setAnnotations,
  setTitle,
  letterPercentage,
  hint,
  setHint,
  lyrics,
  setLyrics,
  helper,
  setHelper,
}: LanguageComponentProps) {
  const [validatedJp, setValidatedJp] = useState(false);
  const [tokens, setTokens] = useState<
    {
      surface: string;
      reading: string | null;
      pronunciation: string | null;
    }[]
  >([]);
  const japanesePercentage = letterPercentage.Japanese;
  console.log('japanesePercentage:', japanesePercentage);
  console.log({ hint });

  const titleInput = lyrics.titleInput;
  const textInput = lyrics.textInput;

  // # validate  ---------------------------------------
  useEffect(() => {
    console.log(textInput.length);
    setValidatedJp(textInput.length > 0 ? true : false);
    setHint(textInput.length > 0 && japanesePercentage < 30 ? true : false);
    setValidatedJp(
      textInput.length > 0 && japanesePercentage < 30 ? false : true
    );
  }, [textInput]);

  // # get lyrics   ---------------------------------------
  async function getLyrics(lyrics: { titleInput: string; textInput: string }) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/japanese`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lyrics),
        }
      );
      const data = await res.json();
      // console.log('data:', data);
      if (res.ok) {
        setTokens(data.tokens);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // $----- WANAKANA -----

  function addRomaji() {
    if (tokens) {
      console.log('tokens-length:', tokens.length);

      const result: { base: string; ruby: string }[] = [];

      for (let i = 0; i < tokens.length; i++) {
        let { surface, pronunciation } = tokens[i];

        if (pronunciation) {
          if (wanakana.isJapanese(surface)) {
            // manually adding double consonants für ッ
            if (
              pronunciation.endsWith('ッ') &&
              tokens[i + 1] &&
              wanakana.isJapanese(tokens[i + 1].surface)
            ) {
              const nextToken = tokens[i + 1];
              // console.log('next token: ', nextToken);

              const consonant = wanakana.toRomaji(
                nextToken.pronunciation ?? ''
              );
              pronunciation = `${pronunciation.slice(0, -1)}~${consonant[0]}`;
            }
            const romaji = wanakana.toRomaji(pronunciation ?? '');
            result.push({ base: surface, ruby: romaji.replace(/oo/g, 'ou') });
          }
        } else {
          result.push({ base: surface, ruby: surface });
        }
      }
      console.log({ result });
      return result;
    }
    return [];
  }

  useEffect(() => {
    const romanizedTokens = addRomaji();
    console.log('romanizedTokens:', romanizedTokens);
    setAnnotations(romanizedTokens);
    setTitle(lyrics.titleInput);
  }, [tokens]);

  // $----------------

  const handleClick = () => {
    console.log({ titleInput }, { textInput });
    const inputLyrics = { titleInput, textInput };

    setLyrics(inputLyrics);
    getLyrics(inputLyrics);
  };

  // console.log('wanakanaResult:', wanakanaResult);
  // console.log('kana:', kana);
  // console.log('romaji:', romaji);
  console.log('tokens', tokens);

  return (
    <>
      <h1>Japanese</h1>
      <section className='input'>
        <form>
          <div className='title-input'>
            <label htmlFor='title'>song title</label>

            <input
              type='text'
              name='title'
              id='title'
              value={titleInput}
              onChange={(e) =>
                setLyrics((prev) => ({
                  ...prev,
                  titleInput: e.target.value,
                }))
              }
              placeholder='add a title'
            />
          </div>
          <div className='text-input'>
            <label htmlFor='japanese-input'>japanese lyrics</label>

            <textarea
              name='japaneseInput'
              id='japanese-input'
              cols={60}
              rows={20}
              value={textInput}
              onChange={(e) =>
                setLyrics((prev) => ({
                  ...prev,
                  textInput: e.target.value,
                }))
              }
              placeholder='paste japanese text here'></textarea>
          </div>
          <div className='input-options'>
            {/* <div className='input-helper'>
              <div className='checkbox'>
                <input
                  type='checkbox'
                  id='advanced'
                  onClick={() => console.log('advanced input not implemented')}
                />
                <label htmlFor='advanced'>advanced input</label>
              </div>
              <p className='helper' onClick={() => setHelper(!helper)}>
                {!helper ? 'input help' : 'close help'}
              </p>
            </div> */}

            {hint && (
              <div className='hint'>
                <p>
                  The input consists of less than 30% Japanese characters. Are
                  you sure you have selected the correct input language?
                </p>
                <p>
                  <span
                    className='verify-option'
                    onClick={() => setValidatedJp(true)}>
                    Yes
                  </span>
                </p>
                <p>
                  Switch to{' '}
                  <span
                    className='verify-option'
                    onClick={() => setLanguage('CHINESE')}>
                    Chinese
                  </span>{' '}
                  or{' '}
                  <span
                    className='verify-option'
                    onClick={() => setLanguage('KOREAN')}>
                    Korean
                  </span>
                </p>
              </div>
            )}

            <button
              className='submit'
              type='button'
              onClick={handleClick}
              disabled={!validatedJp}>
              Submit
            </button>

            {/* {helper && <InputHelper setLanguage={setLanguage} />} */}
          </div>
        </form>
      </section>
    </>
  );
}

export default Japanese;
