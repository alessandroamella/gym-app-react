import React from 'react';
import { View, Button } from 'react-native';
import { startAuth } from '../../utils/auth';
import { useAuth } from '../../components/AuthProvider';

export default function Login() {
  const { signIn } = useAuth();

  const handleLogin = async () => {
    const token = await startAuth();
    if (token) {
      await signIn(token);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title='Login con Telegram' onPress={handleLogin} />
    </View>
  );
}
