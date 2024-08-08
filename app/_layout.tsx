import React from 'react';
import { AuthProvider } from '../components/AuthProvider';
import RootNavigator from '../components/RootNavigator';
import CustomThemeProvider from '@/components/ThemeProvider';

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </CustomThemeProvider>
  );
}
