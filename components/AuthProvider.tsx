import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useRouter } from 'expo-router';

maybeCompleteAuthSession();

type UserData = {
  id: string;
  name: string;
  // Add other fields as necessary
};

type AuthContextType = {
  token: string | null;
  userData: UserData | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTokenAndUserData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (token && userData) {
        router.replace('/(app)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [token, userData, isLoading]);

  const loadTokenAndUserData = async () => {
    try {
      const [storedToken, storedUserData] = await Promise.all([
        SecureStore.getItemAsync('userToken'),
        SecureStore.getItemAsync('userData'),
      ]);

      setToken(storedToken);
      setUserData(storedUserData ? JSON.parse(storedUserData) : null);

      if (storedToken && !storedUserData) {
        // If we have a token but no user data, fetch it from the server
        await fetchUserData(storedToken);
      }
    } catch (e) {
      console.error('Failed to load token or user data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (currentToken: string) => {
    try {
      const response = await fetch('https://home.bitrey.it/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      await SecureStore.setItemAsync('userData', JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      await signOut();
    }
  };

  const signIn = async (newToken: string) => {
    await SecureStore.setItemAsync('userToken', newToken);
    setToken(newToken);
    await fetchUserData(newToken);
  };

  const signOut = async () => {
    await Promise.all([
      SecureStore.deleteItemAsync('userToken'),
      SecureStore.deleteItemAsync('userData'),
    ]);
    setToken(null);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (token) {
      await fetchUserData(token);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, userData, isLoading, signIn, signOut, refreshUserData }}
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
