import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import type { LanguageComponentProps } from '../types';

function Korean({
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
  setScrollToOutput,
}: LanguageComponentProps) {
  const [validatedKr, setValidatedKr] = useState(false);
  const koreanPercentage = letterPercentage.Korean;
  console.log('koreanPercentage:', koreanPercentage);

  const titleInput = lyrics.titleInput;
  const textInput = lyrics.textInput;

  // # validate  ---------------------------------------
  useEffect(() => {
    console.log(textInput.length);
    setValidatedKr(textInput.length > 0 ? true : false);
    setHint(textInput.length > 0 && koreanPercentage < 30 ? true : false);
    setValidatedKr(
      textInput.length > 0 && koreanPercentage < 30 ? false : true
    );
  }, [textInput]);

  // # checks if script is loaded  ---------------------------------------
  useEffect(() => {
    const checkScriptLoaded = () => {
      console.log('checking window.Aromanize...', window.Aromanize);
      if (
        window.String &&
        typeof window.String.prototype.romanize === 'function'
      ) {
        setScriptLoaded(true);
        console.log('✅ Aromanize available; romanize() function loaded');
        clearInterval(intervalId); // stop interval once the script is loaded
      } else {
        console.log('🛑 Aromanize is not available');
      }
    };

    // checks if script is loaded
    const intervalId = setInterval(() => {
      checkScriptLoaded();
    }, 1000);

    // clears interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // # split text & get lyrics   ---------------------------------------
  function splitText(input: string): string[] {
    const regex = /([ \t\n.,!?(){}\[\]<>:;"'-])/;
    return input.split(regex).filter(Boolean);
  }
  async function getLyrics(lyrics: { titleInput: string; textInput: string }) {
    try {
      const splittedHangul = splitText(lyrics.textInput);
      const romanizedInput = textInput.romanize();
      const splittedText = splitText(romanizedInput);
      console.log({ romanizedInput });
      console.log({ splittedText });
      console.log({ splittedHangul });

      if (splittedHangul && splittedHangul.length === splittedText.length) {
        const result: { base: string; ruby: string }[] = [];

        for (let i = 0; i < splittedHangul.length; i++) {
          result.push({ base: splittedHangul[i], ruby: splittedText[i] });
        }
        console.log({ result });
        setAnnotations(result);
        setTitle(lyrics.titleInput);
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
    setScrollToOutput(true);
  };

  console.log('annotations:', annotations);
  // console.log(titleInput);
  console.log('textInput:', textInput);
  console.log(lyrics);
  console.log({ hint });
  console.log({ validatedKr });

  return (
    <>
      <Helmet>
        <script src='https://cdn.jsdelivr.net/npm/aromanize@0.1.5/aromanize.min.js'></script>
      </Helmet>
      {scriptLoaded ? (
        <>
          <h1>Korean</h1>
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
                <label htmlFor='korean-input'>korean lyrics</label>

                <textarea
                  name='koreanInput'
                  id='korean-input'
                  cols={60}
                  rows={20}
                  value={textInput}
                  onChange={(e) =>
                    setLyrics((prev) => ({
                      ...prev,
                      textInput: e.target.value,
                    }))
                  }
                  placeholder='paste korean text here'></textarea>
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
                      The input consists of less than 30% Korean characters. Are
                      you sure you have selected the correct input language?
                    </p>
                    <p>
                      <span
                        className='verify-option'
                        onClick={() => setValidatedKr(true)}>
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
                  disabled={!validatedKr}>
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

export default Korean;
