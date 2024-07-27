const hangulRegex = /[\uAC00-\uD7A3]/;
const hanziRegex = /[\u4E00-\u9FFF]/;
const latinRegex = /[A-Za-z]+/g;
// const japaneseRegex = /[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]/;
// checkt ob es benachtbarte hanzi im text gibt um die zeichen dann auszuschließen, weil man die unicodes von hanzi und kanji nicht komplett trennen kann
// das schließt zwar alle japanischen wörter
const japaneseRegex =
  /[\u3040-\u309F\u30A0-\u30FF]|(?:\u3400-\u4DBF|\u4E00-\u9FFF|\uF900-\uFAFF)(?![\u4E00-\u9FFF])/;

export function checkPercentage(text: string) {
  // const filteredText = text.replace(/[^\p{L}\p{N}]+/gu, '');
  const filteredText = text.replace(/[^\p{L}\p{N}]+/gu, '');
  // console.log(filteredText);

  const totalCharacters = filteredText.length;

  if (totalCharacters === 0)
    return { Chinese: 0, Japanese: 0, Korean: 0, Latin: 0 };
  const languages: { [key: string]: RegExp } = {
    Chinese: hanziRegex,
    Japanese: japaneseRegex,
    Korean: hangulRegex,
    Latin: latinRegex,
  };
  const matchingCharacters: { [key: string]: number } = {
    Chinese: 0,
    Japanese: 0,
    Korean: 0,
    Latin: 0,
  };

  for (let char of text) {
    for (const language in languages) {
      if (languages[language].test(char)) {
        matchingCharacters[language]++;
      }
    }
  }

  const matchingPercentage: { [key: string]: number } = {};
  for (const language in matchingCharacters) {
    // console.log(matchingCharacters[language], totalCharacters);
    matchingPercentage[language] = Math.round(
      (matchingCharacters[language] / totalCharacters) * 100
    );
  }

  return matchingPercentage;
}
