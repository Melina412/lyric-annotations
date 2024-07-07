import { Dispatch, SetStateAction } from 'react';

interface LanguageSelectorProps {
  setLanguage: Dispatch<
    SetStateAction<'CHINESE' | 'JAPANESE' | 'KOREAN' | null>
  >;
}

function InputHelper({ setLanguage }: LanguageSelectorProps) {
  return (
    <>
      <div className='helper-text'>
        <h3>
          Please follow these input rules for the conversion to work correctly:
        </h3>
        <ul>
          <li>
            This field only supports simplified Chinese charachters (漢字), the
            conversion will not work for other languages. If you want to use
            create readings for other languages, go to{' '}
            <button onClick={() => setLanguage('JAPANESE')}>Japanese</button> or{' '}
            <button onClick={() => setLanguage('KOREAN')}>Korean</button>.
          </li>
          <li>
            Spaces, new lines and paragraphs are allowed, but try to avoid them
            in unnecessary places.
          </li>
          <li>
            Double spaces, white spaces at the end of lines or paragraphs are
            not allowed, remove them or the pinyin conversion will fail.
          </li>
          <li>
            Latin letters are possible, but only if they are inside of brackets.
          </li>
          <li>
            <p>
              If you want to add a title to a paragraph, put it inside square
              brackets. Example:
            </p>
            <div className='example'>
              <p>
                {' '}
                <span className='usage correct'>correct</span>
                [Chorus] <br />
                你我像天空与海 <br />
                在水平线想念释怀
              </p>
              <p>
                {' '}
                <span className='usage wrong'>wrong</span>
                Chorus <br />
                你我像天空与海 <br />
                在水平线想念释怀
              </p>
            </div>
          </li>
          <li>
            If you want to add Latin words within the lyrics lines, put them
            inside round brackets.
            <br />
            Example: <br />
            <div className='example'>
              <p>
                <span className='usage correct'>correct</span>(Give me that
                nectar) 拨开乌云的一刹 看清我心中的月
              </p>
              <p>
                <span className='usage wrong'>wrong</span>Give me that nectar
                拨开乌云的一刹 看清我心中的月
              </p>
            </div>
          </li>
          <li>
            Punctuation or special marks like . , ? * & etc. within the text are
            NOT possible!
          </li>
          <li>
            If you have to use them, put them in round bracktes too.
            <br />
            Example: <br />
            <div className='example'>
              <p>
                <span className='usage correct'>correct</span>(Yeah,)
                变幻月相做预兆
              </p>
              <p>
                <span className='usage wrong'>wrong</span>(Yeah), 变幻月相做预兆
              </p>
            </div>
          </li>
          <li>
            Remove all empty spacing at the beginning and at the end of the
            document.
          </li>
        </ul>
      </div>
    </>
  );
}

export default InputHelper;
