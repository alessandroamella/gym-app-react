import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { maybeCompleteAuthSession } from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { AxiosError } from 'axios';
import { config } from '@/constants/config';
import _ from 'lodash';
import { UserData } from '@/app/types';

maybeCompleteAuthSession();

type AuthContextType = {
  token: string | null;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
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

  const fetchUserData = async (token: string) => {
    try {
      console.log('Fetching user data with header:', token);

      const { data } = await config.axiosBase(token).get('/me');
      console.log('Fetched user data:', data);

      setUserData(data);
    } catch (error) {
      console.error(
        'Error fetching user data:',
        (error as AxiosError).response?.data ||
          (error as AxiosError).message ||
          error,
      );
      // Optionally handle the error, e.g., sign out the user if the token is invalid
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
      if (userData) {
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        setUserData,
        isLoading,
        signIn,
        signOut,
        refreshUserData,
      }}
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
