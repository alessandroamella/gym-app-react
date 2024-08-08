import { FC } from 'react';
import { Text, StyleSheet } from 'react-native';
import { TextProps, useColorScheme } from 'react-native';

interface ThemedTextProps extends TextProps {
  light?: boolean;
  bold?: boolean;
}
const ThemedText: FC<ThemedTextProps> = ({
  children,
  style,
  light,
  bold,
  ...other
}) => {
  const colorTheme = useColorScheme();
  return (
    <Text
      {...other}
      style={[
        style,
        colorTheme === 'dark'
          ? light
            ? styles.darkTintedText
            : styles.darkText
          : light
          ? styles.lightTintedText
          : styles.lightText,
        bold && styles.bold,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  lightText: {
    color: 'black',
  },
  lightTintedText: {
    color: 'gray',
  },
  darkText: {
    color: 'white',
  },
  darkTintedText: {
    color: 'lightgray',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default ThemedText;
