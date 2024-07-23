import { useState } from 'react';
import Chinese from '../components/Chinese';
import Japanese from '../components/Japanese';
import Korean from '../components/Korean';
import type { Language, Annotations } from '../types';
import Output from '../components/Output';
import { checkPercentage } from '../utils/ValidateInput';

function Home() {
  const [language, setLanguage] = useState<Language>(null);
  const [annotations, setAnnotations] = useState<Annotations>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>('');
  const [hint, setHint] = useState<boolean>(false);

  console.log({ language });

  const content = {
    title: title,
    text: annotations,
  };
  const letterPercentage = checkPercentage(textInput);
  console.log('letterPercentage:', letterPercentage);
  return (
    <>
      <p>pick a language:</p>
      <div>
        <button onClick={() => setLanguage('CHINESE')}>Chinese</button>
        {/* <button onClick={() => setLanguage('JAPANESE')}>Japanese</button> */}
        <button onClick={() => setLanguage('KOREAN')}>Korean</button>
      </div>
      {language === 'CHINESE' && (
        <Chinese
          language={language}
          setLanguage={setLanguage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          title={title}
          setTitle={setTitle}
          textInput={textInput}
          setTextInput={setTextInput}
          hint={hint}
          setHint={setHint}
          letterPercentage={letterPercentage}
        />
      )}
      {language === 'JAPANESE' && <Japanese setLanguage={setLanguage} />}
      {language === 'KOREAN' && (
        <Korean
          language={language}
          setLanguage={setLanguage}
          annotations={annotations}
          setAnnotations={setAnnotations}
          title={title}
          setTitle={setTitle}
          textInput={textInput}
          setTextInput={setTextInput}
          hint={hint}
          setHint={setHint}
          letterPercentage={letterPercentage}
        />
      )}
      <Output annotations={annotations} content={content} />
    </>
  );
}

export default Home;
