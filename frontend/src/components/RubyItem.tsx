// const bracketedTextRegex = /(?:\([^)]*\)|\[[^\]]*\]|\{[^}]*\})/;
const roundBracketsRegex = /\([^)]*\)/g;
const squareBracketsRegex = /\[[^\]]*\]/g;

// '#' space
// '%' newline
// '§' paragraph

function RubyItem({
  rubyBase,
  rubyText,
}: {
  rubyBase: string;
  rubyText: string;
}) {
  //# '#' space
  if (rubyBase === '#') {
    return <span className='space'></span>;
    //# '%' newline
  } else if (rubyBase === '%') {
    return (
      <>
        <br></br>
        <div className='newline'></div>
      </>
    );
    //# '§' paragraph
  } else if (rubyBase === '§') {
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
    //# das ruby item mit der base und den annotations
  } else {
    return (
      <>
        <span>
          <ruby>
            <span className='hanzi'>{rubyBase}</span>
            <rt className='pinyin'>{rubyText}</rt>
          </ruby>
        </span>
      </>
    );
  }
}

export default RubyItem;
