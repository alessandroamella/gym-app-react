// app/(tabs)/logs.tsx
import { useState } from "react";
import { StyleSheet, View, TextInput, Button } from "react-native";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export default function LogsScreen() {
    const { token } = useAuth();
    const [logData, setLogData] = useState("");

    const handleUpload = async () => {
        try {
            await axios.post(
                "https://api.example.com/logs",
                { data: logData },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLogData("");
            alert("Log uploaded successfully");
        } catch (error) {
            console.error("Error uploading log:", error);
            alert("Failed to upload log");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                multiline
                value={logData}
                onChangeText={setLogData}
                placeholder="Enter log data..."
            />
            <Button title="Upload Log" onPress={handleUpload} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    input: {
        height: 200,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 16,
        padding: 8
    }
});
