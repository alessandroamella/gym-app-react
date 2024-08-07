// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function Index() {
    const { token } = useAuth();

    if (token) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
