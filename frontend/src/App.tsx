import { useState } from 'react';
import './App.css';

import Chinese from './components/Chinese';
import Japanese from './components/Japanese';
import Korean from './components/Korean';

function App() {
  const [language, setLanguage] = useState<
    'CHINESE' | 'JAPANESE' | 'KOREAN' | null
  >(null);

  console.log({ language });

  return (
    <>
      <div></div>
      <p>pick a language:</p>
      <div>
        <button onClick={() => setLanguage('CHINESE')}>Chinese</button>
        {/* <button onClick={() => setLanguage('JAPANESE')}>Japanese</button> */}
        {/* <button onClick={() => setLanguage('KOREAN')}>Korean</button> */}
      </div>

      <Chinese setLanguage={setLanguage} />
      <Japanese setLanguage={setLanguage} />
      <Korean setLanguage={setLanguage} />
    </>
  );
}

export default App;
