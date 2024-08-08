import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import ThemedText from '@/components/ThemedText';
import Container from '@/components/Container';
import StackScreen from '@/components/StackScreen';

export default function Home() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StackScreen title='Robe' />
      <Container>
        <ThemedText style={styles.title}>Home page</ThemedText>
        <ThemedText>useColorScheme(): {colorScheme}</ThemedText>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
});
