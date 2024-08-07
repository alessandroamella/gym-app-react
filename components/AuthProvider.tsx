import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useRouter } from 'expo-router';

maybeCompleteAuthSession();

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthStateChanging: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps extends React.PropsWithChildren<{}> {}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [token, isLoading]);

  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('userToken');
      setToken(storedToken);
    } catch (e) {
      console.error('Failed to load token', e);
    } finally {
      setIsLoading(false);
    }
  };

  const [isAuthStateChanging, setIsAuthStateChanging] = useState(false);

  const signIn = async (newToken: string) => {
    setIsAuthStateChanging(true);
    await SecureStore.setItemAsync('userToken', newToken);
    setToken(newToken);
    setIsAuthStateChanging(false);
  };

  const signOut = async () => {
    setIsAuthStateChanging(true);
    await SecureStore.deleteItemAsync('userToken');
    setToken(null);
    setIsAuthStateChanging(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isLoading, signIn, signOut, isAuthStateChanging }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
