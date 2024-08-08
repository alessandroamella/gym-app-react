import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from 'react-native';

export default function ProtectedLayout() {
  // Determine the current color scheme (light or dark)
  const colorScheme = useColorScheme();

  // Define colors based on the color scheme
  const tabBarOptions = {
    activeTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
    inactiveTintColor: colorScheme === 'dark' ? '#A9A9A9' : '#696969', // DarkGray for dark mode, DimGray for light mode
    style: {
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#F5F5F5', // Darker gray for dark mode, lighter gray for light mode
      borderTopColor: colorScheme === 'dark' ? '#121212' : '#F5F5F5', // Darker gray for dark mode, lighter gray for light mode
      // borderTopColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0', // Border color to add some separation
    },
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabBarOptions.activeTintColor,
        tabBarInactiveTintColor: tabBarOptions.inactiveTintColor,
        tabBarStyle: tabBarOptions.style,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Robe',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Εγώ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
