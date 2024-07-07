import { useState, useRef, Dispatch, SetStateAction } from 'react';
interface LanguageSelectorProps {
  setLanguage: Dispatch<
    SetStateAction<'CHINESE' | 'JAPANESE' | 'KOREAN' | null>
  >;
}

function Korean({ setLanguage }: LanguageSelectorProps) {
  return <></>;
}

export default Korean;
