// app/(auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="login"
                options={{
                    title: "Login"
                    // headerStyle: {
                    //     backgroundColor: "#f4511e"
                    // },
                    // headerTintColor: "#fff",
                    // headerTitleStyle: {
                    //     fontWeight: "bold"
                    // }
                }}
            />
        </Stack>
    );
}
