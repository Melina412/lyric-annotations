import kuromoji from 'kuromoji';

const textJP = '目が覚めるような桜色舞った、やわらかな五月雨の中';
// kuromoji
//   .builder({ dicPath: 'node_modules/kuromoji/dict' })
//   .build((err, tokenizer) => {
//     if (err) throw err;
//     const path = tokenizer.tokenize(textJP);
//     path.forEach((token) => {
//       console.log(`Surface: ${token.surface_form}, Reading: ${token.reading}`);
//     });
//   });
