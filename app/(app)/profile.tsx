import { useAuth } from '@/components/AuthProvider';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Profile() {
  const { signOut, userData } = useAuth();

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Profile', headerShown: true }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {userData?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>
          Your ID: {userData?.id || 'Unknown'}
        </Text>
        <Button title='Sign Out' onPress={signOut} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
});
