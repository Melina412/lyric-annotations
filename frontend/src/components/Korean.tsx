import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import InputHelper from './InputHelper';
import type { LanguageComponentProps } from '../types';
import { checkPercentage } from '../utils/ValidateInput';

function Korean({
  setLanguage,
  annotations,
  setAnnotations,
  title,
  setTitle,
  textInput,
  setTextInput,
  letterPercentage,
  hint,
  setHint,
}: LanguageComponentProps) {
  // const [annotations, setAnnotations] = useState<
  //   { hanzi: string[]; pinyin: string[] }[] | null
  // >(null);

  const [titleInput, setTitleInput] = useState('');
  const [lyrics, setLyrics] = useState<{
    titleInput: string;
    textInput: string;
  } | null>(null);
  // const printRef = useRef<HTMLDivElement | null>(null);
  const [helper, setHelper] = useState(false);
  const [validatedKr, setValidatedKr] = useState(false);
  const koreanPercentage = letterPercentage.Korean;
  console.log('koreanPercentage:', koreanPercentage);

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
      console.log('checking window.Aromanize:', window.Aromanize);
      if (
        window.String &&
        typeof window.String.prototype.romanize === 'function'
      ) {
        console.log('romanize function loaded ✅');
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
  async function getLyrics(formattedLyrics: {
    titleInput: string;
    textInput: string;
  }) {
    try {
      const splittedHangul = splitText(formattedLyrics.textInput);
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
        setTitle(formattedLyrics.titleInput);
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
  console.log('textInput:', textInput);
  console.log(lyrics);
  console.log({ hint });
  console.log({ validatedKr });

  return (
    <div>
      <Helmet>
        <script src='https://cdn.jsdelivr.net/npm/aromanize@0.1.5/aromanize.min.js'></script>
      </Helmet>
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
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder='add a title'
            />
          </div>
          <div className='text-input'>
            <label htmlFor='koreanInput'>korean lyrics</label>

            <textarea
              name='koreanInput'
              id='korean-input'
              cols={60}
              rows={20}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='paste korean text here'></textarea>
          </div>
          <div className='input-options'>
            <div className='input-helper'>
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
            </div>
            {hint && (
              <div className='hint'>
                <p>
                  The input consists of less than 30% Korean characters. Are you
                  sure you have selected the correct input language?
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

            {helper && <InputHelper setLanguage={setLanguage} />}
          </div>
        </form>
      </section>
    </div>
  );
}

export default Korean;
