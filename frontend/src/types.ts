import { Dispatch, SetStateAction } from 'react';

declare global {
  interface String {
    romanize(): string;
  }
  interface Window {
    Aromanize: {};
    pinyinUtil: {
      getPinyin(text: string, delimiter?: string, withTone?: boolean): string;
    };
  }
}

export type Language = 'CHINESE' | 'JAPANESE' | 'KOREAN' | null;

type Annotation = {
  base: string;
  ruby: string;
};

export type Annotations = Annotation[] | null;

export interface LanguageComponentProps {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  annotations: Annotations;
  setAnnotations: Dispatch<SetStateAction<Annotations>>;
  title: string | null;
  setTitle: Dispatch<SetStateAction<string | null>>;
  hint: boolean;
  setHint: Dispatch<SetStateAction<boolean>>;
  letterPercentage: { [key: string]: number };
  lyrics: { titleInput: string; textInput: string };
  setLyrics: Dispatch<SetStateAction<{ titleInput: string; textInput: string }>>;
  helper: boolean;
  setHelper: Dispatch<SetStateAction<boolean>>;
  scriptLoaded: boolean;
  setScriptLoaded: Dispatch<SetStateAction<boolean>>;
  setScrollToOutput: Dispatch<SetStateAction<boolean>>;
  // setTranslation: Dispatch<SetStateAction<LocalStorageTranslation | null>>;
  // saveTranslation: () => void;
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
  language: Language;
  saveTranslation: () => void;
  setAnnotations: Dispatch<SetStateAction<Annotations>>;
  updateTranslation: (id: string, newAnnotations: any[]) => void;
  translation: LocalStorageTranslation | null;
}
export interface PDFDownloaderProps {
  annotations: Annotations;
  content: {
    title: string | null;
    text: Annotations;
  };
  language: Language;
}

export type LocalStorageTranslation = {
  id: string;
  language: Language;
  content: {
    title: string | null;
    text: Annotations;
  };
  createdAt?: string;
  updatedAt?: string;
};
export type KanjiHelpProps = {
  annotations: Annotations;
  setAnnotations: React.Dispatch<React.SetStateAction<Annotations>>;
  translation: LocalStorageTranslation | null;
  saveTranslation: () => void;
  updateTranslation: (id: string, newAnnotations: any[]) => void;
};
