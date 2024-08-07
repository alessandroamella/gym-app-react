import { useState, useEffect } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

const LOGIN_URL = "https://82.58.139.152/login";

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleDeepLink = (event: any) => {
            const data = Linking.parse(event.url);
            if (data.queryParams && data.queryParams.token) {
                const token = data.queryParams.token.toString();
                signIn(token);
                router.replace("/(tabs)");
            }
        };

        const subscription = Linking.addEventListener("url", handleDeepLink);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleLogin = async () => {
        setIsAuthenticating(true);
        const redirectUrl = Linking.createURL("login", { scheme: "gym-app" });

        try {
            await Linking.openURL(`${LOGIN_URL}?redirect_url=${encodeURIComponent(redirectUrl)}`);
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Login Error", "An error occurred while trying to log in.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Login" onPress={handleLogin} disabled={isAuthenticating} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
