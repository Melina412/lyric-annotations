import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

import NotoSansSCLight from '/fonts/Noto_Sans_SC/static/NotoSansSC-Light.ttf';
import NotoSansSCRegular from '/fonts/Noto_Sans_SC/static/NotoSansSC-Regular.ttf';
import NotoSansSCSemiBold from '/fonts/Noto_Sans_SC/static/NotoSansSC-SemiBold.ttf';
import InterRegular from '/fonts/Inter/static/Inter-Regular.ttf';

import type { PdfContent } from '../types';

Font.register({
  family: 'Noto Sans SC Light',
  src: NotoSansSCLight,
});
Font.register({
  family: 'Noto Sans SC Regular',
  src: NotoSansSCRegular,
});
Font.register({
  family: 'Noto Sans SC SemiBold',
  src: NotoSansSCSemiBold,
});
Font.register({
  family: 'Inter Regular',
  src: InterRegular,
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    display: 'flex',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Noto Sans SC SemiBold',
    marginBottom: 20,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    // paddingLeft: 3,
    // paddingRight: 3,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Noto Sans SC Regular',
    marginBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
    letterSpacing: 2,
  },
  annotation: {
    fontSize: 8,
    fontFamily: 'Inter Regular',
    lineHeight: 1,
    textAlign: 'center',
    position: 'absolute',
    top: -5,
    width: '100%',
    whiteSpace: 'nowrap',
  },
  rubyText: {
    flexDirection: 'column',
    alignItems: 'center',
    // marginBottom: 4,
    position: 'relative',
    textAlign: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    whiteSpace: 'nowrap',
  },
  space: {
    // padding: 6,
    padding: 0,
  },
  newline: {
    width: '100%',
    height: 12,
  },
  paragraph: {
    width: '100%',
    height: 24,
  },
  squareBrackets: {
    fontSize: 12,
    fontFamily: 'Inter Regular',
    marginBottom: 1,
    fontWeight: 'bold',
  },
  roundBrackets: {
    fontSize: 12,
    fontFamily: 'Inter Regular',
    marginBottom: 1,
    fontWeight: 'bold',
  },
  other: {
    fontSize: 12,
    fontFamily: 'Inter Regular',
    marginBottom: 1,
    fontWeight: 'bold',
    padding: 0,
  },
});
const roundBracketsRegex = /\([^)]*\)/g;
const squareBracketsRegex = /\[[^\]]*\]/g;
const latinRegex = /[A-Za-z]+/g;
const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~\s]/g;
const numbersRegex = /[0-9]+/g;

const RubyText = ({
  mainText,
  annotation,
}: {
  mainText: string;
  annotation: string;
}) => {
  if (mainText === '#' || mainText === ' ') {
    return <Text style={styles.space}></Text>;
  } else if (mainText === '%' || mainText === '\n') {
    return <View style={styles.newline}></View>;
  } else if (mainText === '§' || mainText === '\n\n') {
    return <View style={styles.paragraph}></View>;
  } else if (mainText.match(squareBracketsRegex)) {
    return (
      <View style={styles.rubyText}>
        <Text style={styles.squareBrackets}>{mainText}</Text>
      </View>
    );
  } else if (mainText.match(roundBracketsRegex)) {
    return (
      <View style={styles.rubyText}>
        <Text style={styles.roundBrackets}>{mainText}</Text>
      </View>
    );
  } else if (
    mainText.match(latinRegex) ||
    mainText.match(punctuationRegex) ||
    mainText.match(numbersRegex)
  ) {
    return (
      <View style={styles.rubyText}>
        <Text style={styles.other}>{mainText}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.rubyText}>
        <Text style={styles.annotation}>{annotation}</Text>
        <Text style={styles.text}>{mainText}</Text>
      </View>
    );
  }
};

const MyDocument = ({ content }: { content: PdfContent }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{content.title}</Text>
        <View style={styles.textContainer}>
          {content.text?.map((item, index) => (
            <RubyText key={index} mainText={item.base} annotation={item.ruby} />
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
