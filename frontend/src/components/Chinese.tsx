import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import type { LanguageComponentProps } from '../types';

function Chinese({
  setLanguage,
  annotations,
  setAnnotations,
  setTitle,
  letterPercentage,
  hint,
  setHint,
  lyrics,
  setLyrics,
  scriptLoaded,
  setScriptLoaded,
}: LanguageComponentProps) {
  const [validatedCh, setValidatedCh] = useState(false);
  const chinesePercentage = letterPercentage.Chinese;
  console.log('chinesePercentage:', chinesePercentage);

  const titleInput = lyrics.titleInput;
  const textInput = lyrics.textInput;

  // # validate  ---------------------------------------
  useEffect(() => {
    console.log('input len:', textInput.length);
    setValidatedCh(textInput.length > 0 ? true : false);
    setHint(textInput.length > 0 && chinesePercentage < 30 ? true : false);
    setValidatedCh(
      textInput.length > 0 && chinesePercentage < 30 ? false : true
    );
  }, [textInput]);

  // # checks if script is loaded  ---------------------------------------
  useEffect(() => {
    const checkScriptLoaded = () => {
      let pinyinUtil = window.pinyinUtil;
      console.log('checking window.pinyinUtil...', pinyinUtil);
      if (pinyinUtil && typeof pinyinUtil.getPinyin === 'function') {
        setScriptLoaded(true);
        console.log('✅ pinyinUtil available; getPinyin() function loaded');
        clearInterval(intervalId); // stop interval once the script is loaded
      } else {
        console.log('🛑 pinyinUtil is not available');
      }
    };

    // checks if script is loaded
    const intervalId = setInterval(() => {
      checkScriptLoaded();
    }, 1000);

    // clears interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // # get lyrics   ----------------------------------------------------

  function splitText(input: string): string[] {
    // const regex = /([ \t\n.,!?(){}\[\]<>:;"'-\u4E00-\u9FFF])/;
    // const regex = /([ \t\n.,!?(){}\[\]<>:;"'-\u4E00-\u9FFF])/;
    // const regex = /([\u4E00-\u9FFF]|[ \t\n.,!?(){}\[\]<>:;"'-])/;

    const regex = /([ \t\n.,!?(){}\[\]<>:;"'-])/;
    return input.split(regex).filter(Boolean);
  }

  async function getLyrics(lyrics: { titleInput: string; textInput: string }) {
    try {
      const textWithSpaces = lyrics.textInput.replace(
        /([\u4E00-\u9FFF])(?=[\u4E00-\u9FFF])/g,
        '$1 '
      );
      const splittedHanzi = splitText(textWithSpaces);
      let pinyinUtil = window.pinyinUtil;
      if (pinyinUtil && typeof pinyinUtil.getPinyin === 'function') {
        const pinyinString = pinyinUtil.getPinyin(textInput, ' ', true);
        const pinyinSegments = splitText(pinyinString);

        const splittedPinyin = pinyinSegments.reduce<string[]>(
          (result, curr, index, segArray) => {
            // durchläuft jedes element in segArray und akkumuliert die elemente in result.
            // wenn das current element ein '\n', wir gecheckt ob davor ' ' ist und wenn ja wird es wieder rausgeschmissen
            // während '\n' zum result gepusht wird.
            // ergänzung: bei ' ' wird auch das element davor geprüft um doppelte leerzeichen rauszuscmeißen
            if (curr === '\n' || curr === ' ') {
              if (result[result.length - 1] === ' ') {
                result.pop();
              }
              result.push(curr);
              // der index bezieht sich auf die anzahl der reduce durchläufe
              // also pro element ein durchlauf heißt man ist jetzt an der stelle des index des ursprünglichen segArrays
              // dort wird das folgende zeichen geprüft und wenn es ein ' ' ist wird es gespliced. dann geht es weiter
              if (segArray[index + 1] === ' ') {
                segArray.splice(index + 1, 1);
              }
              // es entsteht auch manchmal der fehler wenn ein , oder . auf ein hanzi folgt, dass ein ' ' davor eingefügt wurde
              // das muss ich so entfernen weil das ' ' danach ja drin bleiben muss
            } else if (curr === ',' || curr === '.') {
              if (result[result.length - 1] === ' ') {
                result.pop();
              }
              result.push(curr);
              // alle elemente die nicht '\n sind werden direkt einfach gepusht'
            } else {
              result.push(curr);
            }
            return result;
          },
          []
        );

        console.log('pinyinString', pinyinString);
        console.log('splittedHanzi', splittedHanzi);
        // console.log('pinyinSegments', pinyinSegments);
        console.log('splittedPinyin', splittedPinyin);

        if (splittedHanzi && splittedHanzi.length === splittedPinyin.length) {
          const result: { base: string; ruby: string }[] = [];

          for (let i = 0; i < splittedHanzi.length; i++) {
            result.push({ base: splittedHanzi[i], ruby: splittedPinyin[i] });
          }
          console.log({ result });
          setAnnotations(result);
          setTitle(lyrics.titleInput);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = () => {
    console.log({ titleInput }, { textInput });
    const inputLyrics = { titleInput, textInput };

    setLyrics(inputLyrics);
    getLyrics(inputLyrics);
  };

  console.log('annotations:', annotations);
  // console.log(titleInput);
  // console.log('textInput:', textInput);
  console.log(lyrics);
  console.log({ hint });
  console.log({ validatedCh });

  return (
    <>
      <Helmet>
        <script src='https://cdn.jsdelivr.net/npm/pinyin-util@1.2.3/dist/pinyin-util.min.js'></script>
      </Helmet>
      {scriptLoaded ? (
        <>
          <h1>Chinese</h1>
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
                <label htmlFor='chinese-input'>chinese lyrics</label>

                <textarea
                  name='chineseInput'
                  id='chinese-input'
                  cols={60}
                  rows={20}
                  value={textInput}
                  onChange={(e) =>
                    setLyrics((prev) => ({
                      ...prev,
                      textInput: e.target.value,
                    }))
                  }
                  placeholder='paste chinese text here'></textarea>
              </div>
              <div className='input-options'>
                {/* <div className='input-helper'>
                  <div className='checkbox'>
                    <input
                      type='checkbox'
                      id='advanced'
                      onClick={() =>
                        console.log('advanced input not implemented')
                      }
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
                      The input consists of less than 30% Chinese characters.
                      Are you sure you have selected the correct input language?
                    </p>
                    <p>
                      <span
                        className='verify-option'
                        onClick={() => setValidatedCh(true)}>
                        Yes
                      </span>
                    </p>
                    <p>
                      Switch to{' '}
                      <span
                        className='verify-option'
                        onClick={() => setLanguage('KOREAN')}>
                        Korean
                      </span>{' '}
                      or{' '}
                      <span
                        className='verify-option'
                        onClick={() => setLanguage('JAPANESE')}>
                        Japanese
                      </span>
                    </p>
                  </div>
                )}

                <button
                  className='submit'
                  type='button'
                  onClick={handleClick}
                  disabled={!validatedCh}>
                  Submit
                </button>

                {/* {helper && <InputHelper setLanguage={setLanguage} />} */}
              </div>
            </form>
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default Chinese;
