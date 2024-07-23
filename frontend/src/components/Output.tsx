import type { OutputProps } from '../types';
import PdfDownloader from './PdfDownloader';
import RubyItem from './RubyItem';

function Output({ annotations, content }: OutputProps) {
  return (
    <>
      <section className='output'>
        {annotations && (
          <>
            <h2>{content.title}</h2>
            <div className='output-text'>
              {annotations.map((object, index) => (
                <RubyItem
                  key={index}
                  rubyBase={object.base}
                  rubyText={object.ruby}
                />
              ))}
            </div>

            <PdfDownloader annotations={annotations} content={content} />
          </>
        )}
      </section>
    </>
  );
}

export default Output;
