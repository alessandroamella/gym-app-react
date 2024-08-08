import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { ScreenProps } from 'expo-router/build/useScreens';
import { FC } from 'react';
import { useColorScheme } from 'react-native';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from 'react-native-screens/lib/typescript/native-stack/types';

interface StackScreenProps
  extends ScreenProps<
    NativeStackNavigationOptions,
    StackNavigationState<ParamListBase>,
    NativeStackNavigationEventMap
  > {
  title: string;
}

const StackScreen: FC<StackScreenProps> = ({ title, options, ...rest }) => {
  const colorScheme = useColorScheme();

  // Define header styles based on color scheme
  const headerOptions: StackScreenProps['options'] = {
    headerShown: true,
    contentStyle: {
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#f0f0f3', // Slight variation between dark and light modes
    },
    headerTitle: ' ' + title,
    title: title,
    statusBarStyle: colorScheme || 'light',
    headerStyle: {
      backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f3', // Slight variation between dark and light modes
    },
    headerTintColor: colorScheme === 'dark' ? '#e5e5e7' : '#2c2c2e', // Light gray for dark mode, dark gray for light mode
    headerTitleStyle: {
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#ffffff' : '#000000', // White in dark mode, black in light mode
    },
    ...options,
  };

  return <Stack.Screen options={headerOptions as any} {...rest} />;
};

export default StackScreen;
