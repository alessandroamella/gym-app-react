import React from 'react';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerTitle: 'Home', headerBackVisible: true }}
      />
      {/* Add other protected screens here */}
    </Stack>
  );
}
