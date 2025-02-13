import { useState, useEffect, useRef } from 'react';
import Chinese from '../components/Chinese';
import Japanese from '../components/Japanese';
import Korean from '../components/Korean';
import type { Language, Annotations, LocalStorageTranslation } from '../types';
import Output from '../components/Output';
import { checkPercentage } from '../utils/validateInput_temp';

function Home() {
  // $ states & variables -------------------------------
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

  const [translation, setTranslation] = useState<LocalStorageTranslation | null>(null);
  const [savedTranslations, setSavedTranslations] = useState<LocalStorageTranslation[]>([]);

  const content = {
    title: title,
    text: annotations,
  };
  const letterPercentage = checkPercentage(lyrics.textInput);
  // console.log('letterPercentage:', letterPercentage);

  // $ use effects -------------------------------
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

  useEffect(() => {
    getAllTranslations();
  }, []);

  // $ functions -------------------------------

  // # save translation to local storage
  function saveTranslation() {
    console.log('saveTranslation()');
    const translations = JSON.parse(localStorage.getItem('translations') || '[]');
    const newTranslation: LocalStorageTranslation = {
      // ...translation,
      id: crypto.randomUUID(),
      language: language,
      content: {
        title: title,
        text: annotations,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    translations.push(newTranslation);
    localStorage.setItem('translations', JSON.stringify(translations));
    getAllTranslations();
  }

  // # get translations from local storage
  function getAllTranslations() {
    console.log('getAllTranslations()');

    const translations = JSON.parse(localStorage.getItem('translations') || '[]');
    setSavedTranslations(translations);
  }

  function getTranslation(id: string) {
    console.log(`getTranslation(${id})`);

    const translations = JSON.parse(localStorage.getItem('translations') || '[]');
    const translation = translations.find((item: LocalStorageTranslation) => item.id === id);
    setTranslation(translation);

    setTitle(translation ? translation.content.title : null);
    setAnnotations(translation ? translation.content.text : null);
  }

  // # update translations in local storage when readings are manually changed
  function updateTranslation(id: string, newAnnotations: any[]) {
    console.log('updateTranslation()');

    const translations = JSON.parse(localStorage.getItem('translations') || '[]');
    const translationIndex = translations.findIndex((t: LocalStorageTranslation) => t.id === id);

    if (translationIndex !== -1) {
      translations[translationIndex].content.text = newAnnotations;
      translations[translationIndex].updatedAt = new Date().toISOString();

      localStorage.setItem('translations', JSON.stringify(translations));

      getAllTranslations();

      console.log(`Translation with ID ${id} updated.`);
    } else {
      console.warn(`Translation with ID ${id} not found.`);
    }
  }

  // # delete translation from local storage
  function deleteTranslation(id: string) {
    console.log('deleteTranslation()');
    const translations = JSON.parse(localStorage.getItem('translations') || '[]');
    // zum löschen die id herausfiltern und array aktualisieren
    const updatedTranslations = translations.filter((t: LocalStorageTranslation) => t.id !== id);

    if (translations.length === updatedTranslations.length) {
      console.warn(`Translation with ID ${id} not found.`);
      return;
    }
    localStorage.setItem('translations', JSON.stringify(updatedTranslations));
    getAllTranslations();
    console.log(`Translation with ID ${id} deleted.`);
  }

  //# click auf translation aus liste saved translation
  const handleClick = (id: string) => {
    console.log(`handleClick(${id})`);
    translation && console.log(`handleClick title: ${translation.content.title}`);

    getTranslation(id);
  };

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
      <main>
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
            // saveTranslation={saveTranslation}
            // setTranslation={setTranslation}
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
            // saveTranslation={saveTranslation}
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
            // saveTranslation={saveTranslation}
            // setTranslation={setTranslation}
          />
        )}
        <div id='outputTarget' ref={scrollTargetOutput}>
          <Output
            annotations={annotations}
            content={content}
            language={language}
            saveTranslation={saveTranslation}
            setAnnotations={setAnnotations}
            updateTranslation={updateTranslation}
            translation={translation}
          />
        </div>

        <section className='saved-translations'>
          <h2>Saved Translations</h2>
          {savedTranslations.map((translation: LocalStorageTranslation) => (
            <ul key={translation.id} onClick={() => handleClick(translation.id)}>
              <li className='flex-list'>
                <p className='underline-on-hover'>{translation.content.title}</p>
                <button onClick={() => deleteTranslation(translation.id)}>Delete</button>
              </li>
            </ul>
          ))}
        </section>
      </main>
    </>
  );
}

export default Home;
