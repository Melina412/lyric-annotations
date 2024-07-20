import { useState, Dispatch, SetStateAction } from 'react';
import RubyItem from './RubyItem';
import MyDocument from './MyDocument';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import InputHelper from './InputHelper';

interface LanguageSelectorProps {
  setLanguage: Dispatch<
    SetStateAction<'CHINESE' | 'JAPANESE' | 'KOREAN' | null>
  >;
}

function Chinese({ setLanguage }: LanguageSelectorProps) {
  const [annotations, setAnnotations] = useState<
    { hanzi: string; pinyin: string }[] | null
  >(null);
  // const [annotations, setAnnotations] = useState<
  //   { hanzi: string[]; pinyin: string[] }[] | null
  // >(null);

  const [title, setTitle] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [lyrics, setLyrics] = useState<{
    titleInput: string;
    textInput: string;
  } | null>(null);
  // const printRef = useRef<HTMLDivElement | null>(null);
  const [helper, setHelper] = useState(false);

  async function getLyrics(formattedLyrics: {
    titleInput: string;
    textInput: string;
  }) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/chinese`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedLyrics),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log('data', data);
        setAnnotations(data.annotations);
        setTitle(data.title);
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

  const [showPDF, setShowPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!annotations) return;

    const content = {
      title: titleInput,
      text: annotations,
    };
    const doc = <MyDocument content={content} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${titleInput}_lyrics.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  console.log('annotations:', annotations);
  // console.log(titleInput);
  // console.log(textInput);
  console.log(lyrics);

  // const flatAnnotations = annotations?.map((element) => {
  //   return {
  //     hanzi: element.hanzi.join(''),
  //     pinyin: element.pinyin.join(''),
  //   };
  // });

  // console.log('flat', flatAnnotations);

  return (
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
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder='add a title'
            />
          </div>
          <div className='text-input'>
            <label htmlFor='chineseInput'>chinese lyrics</label>

            <textarea
              name='chineseInput'
              id='chinese-input'
              cols={60}
              rows={20}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder='paste chinese text here'></textarea>
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

            <button className='submit' type='button' onClick={handleClick}>
              Submit
            </button>

            {helper && <InputHelper setLanguage={setLanguage} />}
          </div>
        </form>
      </section>

      <section className='output'>
        {annotations && (
          <>
            <h2>{title}</h2>
            <div className='output-text'>
              {annotations.map((object, index) => (
                <RubyItem
                  key={index}
                  rubyBase={object.hanzi}
                  rubyText={object.pinyin}
                />
              ))}
            </div>

            <div className='download'>
              <div>
                <button
                  type='button'
                  onClick={handleDownloadPDF}
                  disabled={!annotations}>
                  Download as PDF
                </button>
                <button
                  type='button'
                  onClick={() => setShowPDF(!showPDF)}
                  disabled={!annotations}>
                  {showPDF ? 'Hide Preview' : 'Preview PDF'}
                </button>
              </div>
              <>
                {showPDF && annotations && (
                  <PDFViewer width='600' height='400'>
                    <MyDocument
                      content={{ title: titleInput, text: annotations }}
                    />
                  </PDFViewer>
                )}
              </>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default Chinese;
