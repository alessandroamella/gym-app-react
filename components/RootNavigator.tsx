import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from './AuthProvider';

export default function RootNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    // You can return a loading screen here
    return null;
  }

  if (token) {
    return (
      <Stack>
        <Stack.Screen name='(app)' options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name='(auth)/login' options={{ headerShown: false }} />
    </Stack>
  );
}
