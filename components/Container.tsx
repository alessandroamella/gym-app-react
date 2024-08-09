import React, { FC } from 'react';
import { View, StyleSheet, useColorScheme, ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {}

const Container: FC<ContainerProps> = ({ children }) => {
  const colorScheme = useColorScheme();

  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  return <View style={styles.container}>{children}</View>;
};

// Light theme styles
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    color: '#000000',
    fontSize: 18,
  },
});

// Dark theme styles
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default Container;
