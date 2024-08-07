// app/(tabs)/home.tsx
import { useState, useEffect } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../types";

export default function HomeScreen() {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("https://api.example.com/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (token) {
            fetchUsers();
        }
    }, [token]);

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.userItem}>
                        <Text>{item.name}</Text>
                        <Text>Score: {item.score}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    userItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    }
});
