import React from 'react';
import { AuthProvider } from '../components/AuthProvider';
import RootNavigator from '../components/RootNavigator';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
