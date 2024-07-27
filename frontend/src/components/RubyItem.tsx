// const bracketedTextRegex = /(?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\})/;
const roundBracketsRegex = /\([^)]*\)/g;
const squareBracketsRegex = /\[[^\]]*\]/g;
const latinRegex = /[A-Za-z]+/g;
const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s]/g;
const numbersRegex = /[0-9]+/g;
const hangulRegex = /([\uAC00-\uD7A3]|[ \t\n.,!?(){}\[\]<>:;"'-])/;
const hanziRegex = /[\u4E00-\u9FFF]/;
const kanjiRegex = /([\u4E00-\u9FAF]|[ \t\n.,!?(){}\[\]<>:;"'-])/;
const kanaRegex = /([\u3040-\u309F\u30A0-\u30FF]|[ \t\n.,!?(){}\[\]<>:;"'-])/;
const japaneseRegex =
  /([\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]|[ \t\n.,!?(){}\[\]<>:;"'-])/;

import type { Language } from '../types';
import { useEffect } from 'react';

// '#' space
// '%' newline
// '§' paragraph

// // das event muss außerhalb der komponente sein weil es sonst bei jedem rendern wiederholt erstellt wird (einmal pro gerendertem ruby item)
// const handleClick = (event: MouseEvent) => {
//   const target = event.target as HTMLElement;
//   if (target && target.classList.contains('kanji')) {
//     console.log('Clicked:', target);
//   }
// };

function RubyItem({
  rubyBase,
  rubyText,
  language,
  handleClick,
}: {
  rubyBase: string;
  rubyText: string;
  language: Language;
  handleClick: (event: MouseEvent) => void;
}) {
  const rubyBaseClass =
    rubyBase.match(kanjiRegex) && language === 'JAPANESE'
      ? 'kanji'
      : rubyBase.match(kanaRegex) && language === 'JAPANESE'
      ? 'kana'
      : rubyBase.match(hanziRegex) && language === 'CHINESE'
      ? 'hanzi'
      : rubyBase.match(hangulRegex)
      ? 'hangul'
      : '';

  const rubyTextClass =
    (language === 'JAPANESE' && rubyBase.match(kanjiRegex)) ||
    rubyBase.match(kanaRegex)
      ? 'romaji'
      : rubyBase.match(hanziRegex)
      ? 'pinyin'
      : rubyBase.match(hangulRegex)
      ? 'romaja'
      : '';

  //# '#' space
  //$ ' ' space
  if (rubyBase === '#' || rubyBase === ' ') {
    return <span className='space'> </span>;
    //# '%' newline
    //$ '\n' newline
  } else if (rubyBase === '%' || rubyBase === '\n') {
    return (
      <>
        <br></br>
        <div className='newline'></div>
      </>
    );
    //# '§' paragraph
    //$ '\n\n' paragraph
  } else if (rubyBase === '§' || rubyBase === '\n\n') {
    return (
      <>
        <br></br>
        <div className='paragraph'></div>
      </>
    );
    //   //# text in allen brackets
    // } else if (bracketedTextRegex.test(rubyBase)) {
    //   return (
    //     <>
    //       <div>{rubyBase}</div>
    //     </>
    //   );
    //# text in square brackets
  } else if (rubyBase.match(squareBracketsRegex)) {
    return (
      <>
        <span className='square-brackets'>{rubyBase}</span>
      </>
    );
    //# text in round brackets
  } else if (rubyBase.match(roundBracketsRegex)) {
    return (
      <>
        <span className='round-brackets'>{rubyBase}</span>
      </>
    );
    //$ latin letters
  } else if (
    rubyBase.match(latinRegex) ||
    rubyBase.match(punctuationRegex) ||
    rubyBase.match(numbersRegex)
  ) {
    return (
      <>
        <span className='other'>{rubyBase}</span>
      </>
    );
    //# das ruby item mit der base und den annotations
  } else {
    // der use effect muss (glaube ich lol) hier sein weil der ja jedes mal wenn sich die ruby componente ändert aktualisiert werden muss
    // useEffect(() => {
    //   document.addEventListener('click', handleClick);

    //   return () => {
    //     document.removeEventListener('click', handleClick);
    //   };
    // }, []);

    return (
      <>
        <span>
          <ruby>
            <span className={rubyBaseClass}>{rubyBase}</span>
            <rt className={rubyTextClass}>{rubyText}</rt>
          </ruby>
        </span>
      </>
    );
  }
}

export default RubyItem;
