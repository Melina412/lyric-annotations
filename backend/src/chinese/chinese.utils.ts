// placeholder for text format
const SPACE_PLACEHOLDER = '#';
const NEWLINE_PLACEHOLDER = '%';
const PARAGRAPH_PLACEHOLDER = '§';

// Regex expressions
const hanziRegex = /[\u4E00-\u9FFF]/;
const latinRegex = /[A-Za-z]+/g;
// const latinRegex = /[\p{L}]+/gu; // words with latin characters + diacritics

const roundBracketsRegex = /\([^)]*\)/g;
const squareBracketsRegex = /\[[^\]]*\]/g;

const openBracketsRegex = /(?<=[\(\[])/g;
const closeBracketsRegex = /(?=[\)\]])/g;
const beforeOpenBrackets = /(?=[(\[])/g;
const afterCloseBrackets = /(?<=[)\]]+)/g;

function replaceSpaces(input: string): string {
  let result = '';
  let lastIndex = 0;

  const combinedRegex = new RegExp(
    `${roundBracketsRegex.source}|${squareBracketsRegex.source}`,
    'g'
  );

  input.replace(combinedRegex, (match, index) => {
    const beforeMatch = input.slice(lastIndex, index);

    const replacedText = beforeMatch
      .replace(/ /g, SPACE_PLACEHOLDER) // space
      .replace(/\n\n/g, PARAGRAPH_PLACEHOLDER) // double newline
      .replace(/\n/g, NEWLINE_PLACEHOLDER); // newline

    result += replacedText + match;
    lastIndex = index + match.length;

    return match;
  });

  const restText = input.slice(lastIndex);
  result += restText
    .replace(/ /g, SPACE_PLACEHOLDER)
    .replace(/\n\n/g, PARAGRAPH_PLACEHOLDER)
    .replace(/\n/g, NEWLINE_PLACEHOLDER);

  return result;
}
export function splitText(text: string): string[] {
  const replacedInput = replaceSpaces(text);
  const segments = [];
  let currentSegment = '';

  for (let i = 0; i < replacedInput.length; i++) {
    const char = replacedInput[i];
    if (
      char === SPACE_PLACEHOLDER ||
      char === NEWLINE_PLACEHOLDER ||
      char === PARAGRAPH_PLACEHOLDER
    ) {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
      segments.push(char);
    } else if (char.match(openBracketsRegex)) {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
      currentSegment += char;
    } else if (char.match(closeBracketsRegex)) {
      currentSegment += char;
      segments.push(currentSegment);
      currentSegment = '';
    } else if (char.match(hanziRegex)) {
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = '';
      }
      segments.push(char);
    } else {
      currentSegment += char;
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }
  return segments;
}

export function splitPinyin(pinyinString: string): string[] {
  let splittedPinyin: string[] = [];
  pinyinString.split('-').flatMap((segment) => {
    // console.log({ segment });
    if (segment.match(openBracketsRegex)) {
      const splittedSegment = segment.split(beforeOpenBrackets).filter(Boolean);
      //   console.log('openBracketsSegment', segment);
      //   console.log('splittedSegment', splittedSegment);
      //   console.log('------------------------------------');

      splittedSegment.flatMap((seg) => {
        console.log({ seg });
        if (seg.match(closeBracketsRegex)) {
          const splittedSeg = seg.split(afterCloseBrackets).filter(Boolean);
          //   console.log('closeBracketsSeg', seg);
          //   console.log('splittedSeg', splittedSeg);
          //   console.log('------------------------------------');
          splittedSeg.forEach((str) => {
            console.log({ str });
            splittedPinyin.push(str);
            return str;
          });
        } else {
          splittedPinyin.push(seg);
          return splittedSegment;
        }
      });
    } else {
      splittedPinyin.push(segment);
    }
    return segment;
  });

  return splittedPinyin;
}
