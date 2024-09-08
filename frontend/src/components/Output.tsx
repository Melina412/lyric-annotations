import type { OutputProps } from '../types';
import PdfDownloader from './PdfDownloader';
import RubyItem from './RubyItem';
import KanjiHelp from './KanjiHelp';

function Output({ annotations, content, language }: OutputProps) {
  // drucken des divs #textToPrint über browserprint
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

  console.log({ language });

  return (
    <>
      <section className='output'>
        <KanjiHelp annotations={annotations} />

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
