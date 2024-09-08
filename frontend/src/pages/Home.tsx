import { useState, useEffect, useRef } from 'react';
import Chinese from '../components/Chinese';
import Japanese from '../components/Japanese';
import Korean from '../components/Korean';
import type { Language, Annotations } from '../types';
import Output from '../components/Output';
import { checkPercentage } from '../utils/validateInput_temp';

function Home() {
  const [language, setLanguage] = useState<Language>(null);
  const [annotations, setAnnotations] = useState<Annotations>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [hint, setHint] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<{
    titleInput: string;
    textInput: string;
  }>({
    titleInput: '',
    textInput: '',
  });
  const [helper, setHelper] = useState<boolean>(false);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);

  const scrollTargetInput = useRef<HTMLDivElement | null>(null);
  const scrollTargetOutput = useRef<HTMLDivElement | null>(null);
  const [scrollToOutput, setScrollToOutput] = useState<boolean>(false);

  const content = {
    title: title,
    text: annotations,
  };
  const letterPercentage = checkPercentage(lyrics.textInput);
  // console.log('letterPercentage:', letterPercentage);

  useEffect(() => {
    setAnnotations(null);
  }, [language]);

  useEffect(() => {
    if (language && scrollTargetInput.current) {
      scrollTargetInput.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [language]);

  useEffect(() => {
    if (scrollToOutput && scrollTargetOutput.current) {
      scrollTargetOutput.current.scrollIntoView({ behavior: 'smooth' });
    }
    setScrollToOutput(false);
  }, [scrollToOutput]);

  // let viteenvs = import.meta.env;
  // console.log(viteenvs);
  // console.log({ language });

  return (
    <>
      <header>
        <div className='banner'>
          <h1>Lyric Annotations</h1>
        </div>
      </header>
      <section className='language-selector'>
        <p>Select a language!</p>
        <div ref={scrollTargetInput}>
          <button onClick={() => setLanguage('CHINESE')}>Chinese</button>
          <button onClick={() => setLanguage('JAPANESE')}>Japanese</button>
          <button onClick={() => setLanguage('KOREAN')}>Korean</button>
        </div>
      </section>

      {language === 'CHINESE' && (
        <Chinese
          language={language}
          setLanguage={setLanguage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          title={title}
          setTitle={setTitle}
          hint={hint}
          setHint={setHint}
          letterPercentage={letterPercentage}
          lyrics={lyrics}
          setLyrics={setLyrics}
          helper={helper}
          setHelper={setHelper}
          scriptLoaded={scriptLoaded}
          setScriptLoaded={setScriptLoaded}
          setScrollToOutput={setScrollToOutput}
        />
      )}
      {language === 'JAPANESE' && (
        <Japanese
          language={language}
          setLanguage={setLanguage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          title={title}
          setTitle={setTitle}
          hint={hint}
          setHint={setHint}
          letterPercentage={letterPercentage}
          lyrics={lyrics}
          setLyrics={setLyrics}
          helper={helper}
          setHelper={setHelper}
          scriptLoaded={scriptLoaded}
          setScriptLoaded={setScriptLoaded}
          setScrollToOutput={setScrollToOutput}
        />
      )}
      {language === 'KOREAN' && (
        <Korean
          language={language}
          setLanguage={setLanguage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          title={title}
          setTitle={setTitle}
          hint={hint}
          setHint={setHint}
          letterPercentage={letterPercentage}
          lyrics={lyrics}
          setLyrics={setLyrics}
          helper={helper}
          setHelper={setHelper}
          scriptLoaded={scriptLoaded}
          setScriptLoaded={setScriptLoaded}
          setScrollToOutput={setScrollToOutput}
        />
      )}
      <div ref={scrollTargetOutput}>
        <Output
          annotations={annotations}
          content={content}
          language={language}
        />
      </div>
    </>
  );
}

export default Home;
