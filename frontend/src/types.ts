import { Dispatch, SetStateAction } from 'react';

declare global {
  interface String {
    romanize(): string;
  }
  interface Window {
    Aromanize: {};
  }
}

export type Language = 'CHINESE' | 'JAPANESE' | 'KOREAN' | null;

// export interface SetLanguage {
//   setLanguage: Dispatch<SetStateAction<Language>>;
// }

type Annotation = {
  base: string;
  ruby: string;
};

export type Annotations = Annotation[] | null;

// export interface SetAnnotations {
//   setAnnotations: Dispatch<SetStateAction<Annotations>>;
// }

export interface LanguageComponentProps {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  annotations: Annotations;
  setAnnotations: Dispatch<SetStateAction<Annotations>>;
  title: string | null;
  setTitle: Dispatch<SetStateAction<string | null>>;
  textInput: string;
  setTextInput: Dispatch<SetStateAction<string>>;
  hint: boolean;
  setHint: Dispatch<SetStateAction<boolean>>;
  letterPercentage: { [key: string]: number };
}

export type PdfContent = {
  title: string | null;
  text: Annotations;
};

export interface OutputProps {
  annotations: Annotations;
  content: {
    title: string | null;
    text: Annotations;
  };
}
