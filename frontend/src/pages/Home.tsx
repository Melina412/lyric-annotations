import { useState, useEffect } from 'react';
import Chinese from '../components/Chinese';
import Japanese from '../components/Japanese';
import Korean from '../components/Korean';
import type { Language, Annotations } from '../types';
import Output from '../components/Output';
import checkPercentage from '../utils/validateInput';

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

  console.log({ language });

  const content = {
    title: title,
    text: annotations,
  };
  const letterPercentage = checkPercentage(lyrics.textInput);
  // console.log('letterPercentage:', letterPercentage);

  useEffect(() => {
    setAnnotations(null);
  }, [language]);

  return (
    <>
      <section className='language-selector'>
        <p>Select a language!</p>
        <div>
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
        />
      )}
      <Output annotations={annotations} content={content} language={language} />
    </>
  );
}

export default Home;
