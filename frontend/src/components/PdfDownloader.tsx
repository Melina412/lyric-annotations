import { useState } from 'react';
import MyDocument from './MyDocument';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import type { OutputProps } from '../types';

function PdfDownloader({ annotations, content, language }: OutputProps) {
  const [showPDF, setShowPDF] = useState(false);

  const handleDownloadPDF = async () => {
    if (!annotations) return;

    const doc = <MyDocument content={content} language={language} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title}_lyrics.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
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
          {showPDF && content && (
            <PDFViewer width='600' height='400'>
              <MyDocument content={content} language={language} />
            </PDFViewer>
          )}
        </>
      </div>
    </>
  );
}

export default PdfDownloader;
