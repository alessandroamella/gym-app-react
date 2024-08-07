// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "../types";

interface AuthContextType extends AuthState {
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        isLoading: true
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem("userToken");
            setAuthState({ token, isLoading: false });
        };
        loadToken();
    }, []);

    const signIn = async (token: string) => {
        await AsyncStorage.setItem("userToken", token);
        setAuthState({ token, isLoading: false });
    };

    const signOut = async () => {
        await AsyncStorage.removeItem("userToken");
        setAuthState({ token: null, isLoading: false });
    };

    return (
        <AuthContext.Provider value={{ ...authState, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
