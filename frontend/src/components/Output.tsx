import type { OutputProps } from '../types';
import PdfDownloader from './PdfDownloader';
import RubyItem from './RubyItem';

import { useEffect, useState } from 'react';
import * as wanakana from 'wanakana';

function Output({ annotations, content, language }: OutputProps) {
  const [help, setHelp] = useState(false);
  const [kanji, setKanji] = useState<string>('');
  const [romaji, setRomaji] = useState<string>('');
  const [altReadings, setAltReadings] = useState<string[] | null>(null);
  const [altKanjiReadings, setAltKanjiReadings] = useState<
    | {
        kanji: string;
        readings: string[];
      }[]
    | null
  >(null);

  const kanjiRegex = /([\u4E00-\u9FAF])/;

  function printText() {
    const element = document.getElementById('textToPrint');

    if (element) {
      // Text des Elements markieren
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Druckdialog öffnen
      window.print();

      // Auswahl entfernen, nachdem der Druckdialog geschlossen wurde
      setTimeout(() => {
        selection?.removeAllRanges();
      }, 0);
    }
  }

  //$ getAlternativeKanjiReadings() ---------------------------------------------------------------

  async function getAlternativeKanjiReadings(expression: string): Promise<any> {
    console.log('expression:', expression);

    console.log('length:', expression.length);

    if (expression.length === 1) {
      const res = await fetch(`https://kanjiapi.dev/v1/kanji/${expression}`);
      const data = await res.json();
      console.log('kanji api data ', data);

      if (res.ok) {
        const kun: string[] = data.kun_readings;
        const on: string[] = data.on_readings;
        const names: string[] = data.name_readings;
        let altReadings: string[] = [];

        if (kun.length > 0) {
          altReadings = [...altReadings, ...kun];
        }
        if (on.length > 0) {
          altReadings = [...altReadings, ...on];
        }
        if (names.length > 0) {
          altReadings = [...altReadings, ...names];
        }
        console.log('altReadings:', altReadings);
        setAltReadings(altReadings);
      }
    } else if (expression.length > 1) {
      // const url = `https://jisho.org/api/v1/search/words?keyword=${expression}`;
      // fetch direkt an die api geht nicht weil jisho anfragen von node fetch & axios blockt.
      // um das zu umgehen muss der header manuell gesetzt werden was vom client aus nicht geht wegen cors
      // deshalb umweg über das backend wo der fetch nicht durch den browser muss und cors egal ist
      const resJisho = await fetch(
        `${
          import.meta.env.VITE_BACKENDURL
        }/api/japanese/jisho/words?keyword=${expression}`
      );

      // # jisho geht in manchen fällen nicht so gut also viel. nehme ich einfach direkt die jotoba api??
      const resJotoba = await fetch(`https://jotoba.de/api/search/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: expression,
          language: 'English',
          no_english: false,
        }),
      });
      const dataJotoba = await resJotoba.json();
      console.log('jotoba api data ', dataJotoba);

      if (resJotoba.ok) {
        let data_2_words = dataJotoba.words;
        let data_2_kanji = dataJotoba.kanji;

        console.log('data_2_words:', data_2_words);
        console.log('data_2_kanji:', data_2_kanji);

        // let altReadings: string[] = [];
        // let altSet = new Set<string>();
        // for (const item of data_2_words) {
        //   console.log('item kanji:', item.reading.kanji);
        //   console.log('item kana:', item.reading.kana);
        //   console.log('item furigana:', item.reading.furigana);

        //   altSet.add(item.reading.furigana);
        //   console.log('altSet:', altSet);
        //   altReadings = Array.from(altSet);
        //   console.log('altReadings from data 2:', altReadings);

        //   setAltReadings(altReadings);
        // }

        // const kanji: string[] = data_2.kanji;
        // const words: string[] = data_2.words;
      }

      const dataJisho = await resJisho.json();
      console.log('dataJisho ', dataJisho);

      let altReadings: string[] = [];
      let altSet = new Set<string>();
      if (resJisho.ok && dataJisho.data.length > 0) {
        let data = dataJisho.data;
        console.log('dataJisho.data ', data);

        for (const item of data) {
          console.log('item slug:', item.slug);

          if (
            item.slug === expression ||
            item.slug.includes(`${expression}-`) ||
            item.slug.startsWith(expression)
          ) {
            console.log('item.japanese:', item.japanese);
            for (const i of item.japanese) {
              if (i.reading) {
                altSet.add(i.reading);
                altReadings = Array.from(altSet);
              }
            }

            console.log('altReadings:', altReadings);
            setAltReadings(altReadings);

            // } else if (item.slug.includes(expression)) {
            //   //
          } else {
            console.log('altReadings:', altReadings);
            console.log(
              `no match found expression ${expression} in slug ${item.slug}`
            );
          }
        }
        // # alternative kanji readings wenn der ausdruch nicht gefunden wurde
        // } else {
      }
      if (altReadings.length === 0) {
        let subExpressions = expression.split('');
        console.log('subExpressions:', subExpressions);

        let altKanji = new Set<string>();
        subExpressions.forEach((subEx) => {
          subEx.match(kanjiRegex) ? altKanji.add(subEx) : null;
        });
        console.log('altKanji:', altKanji);
        for (const subEx of altKanji) {
          console.log('subEx', subEx);
          const res = await fetch(`https://kanjiapi.dev/v1/kanji/${subEx}`);
          const data = await res.json();
          console.log('kanji api data ', data);

          const kun: string[] = data.kun_readings;
          const on: string[] = data.on_readings;
          const names: string[] = data.name_readings;
          let altReadings: string[] = [];

          if (kun.length > 0) {
            altReadings = [...altReadings, ...kun];
          }
          if (on.length > 0) {
            altReadings = [...altReadings, ...on];
          }
          if (names.length > 0) {
            altReadings = [...altReadings, ...names];
          }
          console.log('altReadings:', altReadings);

          // setAltKanjiReadings([{ kanji: subEx, readings: altReadings }]);
          setAltKanjiReadings((prev) => {
            const newReadings = [
              ...(prev || []),
              { kanji: subEx, readings: altReadings },
            ];
            return newReadings;
          });
        }
      }
    }
  }

  // const slug = '詰まり';
  // const test = '詰ま';
  // console.log(slug.startsWith(test));

  //$ handleKanjiClick() --------------------------------------------------------------------------
  // das event muss außerhalb der rubyitem komponente sein weil es sonst bei jedem rendern wiederholt erstellt wird (einmal pro gerendertem ruby item)
  const expression = document.getElementById('expression');
  const pronunciation = document.getElementById('pronunciation');

  const handleKanjiClick = (event: MouseEvent) => {
    setAltReadings(null);
    setAltKanjiReadings(null);
    const target = event.target as HTMLElement;
    const sibling = target.nextElementSibling;

    const modal = document.getElementById('modal') as HTMLDialogElement;

    if (target && target.classList.contains('kanji')) {
      if (modal) {
        modal.showModal();
      }
      console.log('target:', target);
      console.log('sibling:', target.nextElementSibling);
      setHelp(true);
      const text = target.textContent;

      // * cut kanji ending
      if (expression && text) {
        console.log('expression:', expression);
        console.log('text:', text);
        console.log('text[-1] ', text.slice(-1));

        if (text.slice(-1) === 'っ' || text.slice(-1) === 'ッ') {
          console.log('last letter is っ or ッ –> cut');
          setKanji(text.slice(0, -1));
          // console.log('text[0:-1] ', text.slice(0, -1));
        } else {
          setKanji(text);
        }
      } else {
        console.error('expression or text element not found');
      }

      // * cut romaji ending
      if (sibling) {
        const reading = sibling.textContent;
        console.log('reading:', reading);

        if (pronunciation && reading) {
          console.log('pronunciation:', pronunciation);
          if (reading.indexOf('~') !== -1) {
            console.log('index of ~:', reading.indexOf('~'));
            setRomaji(reading.slice(0, reading.indexOf('~')));
          } else {
            setRomaji(reading);
          }
        }
      } else {
        console.error('silbing element not found');
      }
    }
  };

  // const handleButtonClick = () => {
  //   const modal = document.getElementById('modal')  as HTMLDialogElement;
  //   if (modal){
  //     modal.showModal()

  //   }
  // }

  //$ useEffects ----------------------------------------------------

  useEffect(() => {
    document.addEventListener('click', handleKanjiClick);

    return () => {
      document.removeEventListener('click', handleKanjiClick);
    };
  }, [annotations]);

  // console.log('annotations:', annotations);
  useEffect(() => {
    console.log('kanji aus uef:', kanji);
    console.log('romaji aus uef:', romaji);
    console.log('%c----------------------------------', 'color: #9580F7;');
  }, [kanji]);

  console.log({ altReadings });
  console.log('altKanjiReadings:', altKanjiReadings);

  return (
    <>
      <section className='output'>
        {/* elemente müssen beim ersten rendern der seite erstellt werden wg. getElement */}
        {/* <div id='kanjiHelp' className={help ? 'active' : 'inactive'}> */}
        {/* aber da ich die jetzt im dem dialog habe sind sie ja sowieso immer da */}
        <div id='kanjiHelp'>
          {/* <p>help div</p>
          <p>
            Is '<span id='pronunciation'>{romaji}</span>' the wrong
            pronunciation for <span id='expression'>{kanji}</span>?
          </p>

          <button onClick={() => getAlternativeKanjiReadings(kanji)}>
            Get alternative readings
          </button>

          <button onClick={() => setHelp(false)}>Close</button> */}

          <dialog id='modal' className='modal'>
            <div className='modal-box'>
              <p>
                Is '<span id='pronunciation'>{romaji}</span>' the wrong
                pronunciation for <span id='expression'>{kanji}</span> ?
              </p>

              <button onClick={() => getAlternativeKanjiReadings(kanji)}>
                Get alternative readings
              </button>

              <div
                className={`alt-readings ${
                  altReadings ? 'active' : 'inactive'
                }`}>
                <p>Alternative reading options for {kanji}:</p>
                {altReadings ? (
                  <>
                    <ul id='readings'>
                      {altReadings.map((option, index) => (
                        <li key={index}>
                          <span>
                            {wanakana.toRomaji(option)} ({option})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <div
                className={`alt-readings ${
                  altKanjiReadings ? 'active' : 'inactive'
                }`}>
                <p>
                  ...no alternative readings found for {kanji}. Here are some
                  readings for the single kanji:
                </p>
                {altKanjiReadings ? (
                  <>
                    <div id='readings'>
                      {altKanjiReadings.map((option, i) => (
                        <ul key={i}>
                          {option.kanji}:
                          {option.readings.map((reading, j) => (
                            <li key={j}>
                              <span>
                                {wanakana.toRomaji(reading)} ({reading})
                              </span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  </>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <div className='modal-action'>
                <form method='dialog'>
                  {/* if there is a button in form, it will close the modal */}
                  <button>Close</button>
                </form>
              </div>
            </div>
          </dialog>

          {/* <div className={altReadings ? 'active' : 'inactive'}>
            <p>Alternative reading options for {kanji}:</p>
            <ul id='readings'>
              {altReadings &&
                altReadings.map((option, index) => (
                  <li key={index}>{wanakana.toRomaji(option)}</li>
                ))}
            </ul>
            <button onClick={() => setHelp(false)}>Ok</button>
          </div> */}
        </div>

        {annotations && (
          <>
            <div id='textToPrint'>
              <h2>{content.title}</h2>
              <div className='output-text'>
                {annotations.map((object, index) => (
                  <RubyItem
                    key={index}
                    rubyBase={object.base}
                    rubyText={object.ruby}
                    language={language}
                    handleClick={handleKanjiClick}
                  />
                ))}
              </div>
            </div>
            <button id='print' onClick={printText}>
              Print
            </button>

            <PdfDownloader
              annotations={annotations}
              content={content}
              language={language}
            />
          </>
        )}
      </section>
    </>
  );
}

export default Output;
