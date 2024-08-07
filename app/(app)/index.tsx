import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../components/AuthProvider';
import { Stack } from 'expo-router';

export default function Home() {
  const { signOut } = useAuth();

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Home', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the protected home page!</Text>
      </View>
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
