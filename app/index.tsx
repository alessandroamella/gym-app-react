import { Redirect } from 'expo-router';
import { useAuth } from '../components/AuthProvider';
import { ActivityIndicator } from 'react-native';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (token) {
    return <Redirect href='/(app)' />;
  }

  return <Redirect href='/(auth)/login' />;
}
