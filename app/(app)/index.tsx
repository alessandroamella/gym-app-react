import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../components/AuthProvider';

export default function Home() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the protected home page!</Text>
      <Button title='Sign Out' onPress={signOut} />
    </View>
  );
}
