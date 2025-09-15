import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, FlatList, Alert } from "react-native";
import { createLobby, joinLobby } from "./src/services/api";
import { connect, sendMessage, disconnect } from "./src/services/websocket";

type Player = { id: string; name: string };

export default function App() {
    const [lobbyCode, setLobbyCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [players, setPlayers] = useState<Player[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    // Connect WebSocket once
    useEffect(() => {
        connect((msg) => setMessages((prev) => [...prev, msg]));
        return () => disconnect();
    }, []);

    // Create Lobby
    const handleCreateLobby = async () => {
        try {
            const data = await createLobby();
            setLobbyCode(data.code);
            Alert.alert("Lobby Created", `Lobby code: ${data.code}`);
        } catch (err) {
            console.error("Error creating lobby:", err);
            Alert.alert("Error", "Failed to create lobby");
        }
    };

    // Join Lobby
    const handleJoinLobby = async () => {
        if (!lobbyCode || !playerName) {
            Alert.alert("Error", "Enter your name and lobby code");
            return;
        }
        try {
            const data = await joinLobby(lobbyCode, playerName);
            setPlayers(data.players);
        } catch (err) {
            console.error("Error joining lobby:", err);
            Alert.alert("Error", "Failed to join lobby");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
                Word Imposter MVP
            </Text>

            <Button title="Create Lobby" onPress={handleCreateLobby} />

            <TextInput
                placeholder="Enter your name"
                value={playerName}
                onChangeText={setPlayerName}
                style={{ borderWidth: 1, marginVertical: 5, padding: 8, borderRadius: 5 }}
            />
            <TextInput
                placeholder="Enter lobby code"
                value={lobbyCode}
                onChangeText={setLobbyCode}
                style={{ borderWidth: 1, marginVertical: 5, padding: 8, borderRadius: 5 }}
            />
            <Button title="Join Lobby" onPress={handleJoinLobby} />

            <Text style={{ marginTop: 15, fontWeight: "bold" }}>Players in Lobby:</Text>
            <FlatList
                data={players}
                renderItem={({ item }) => <Text style={{ paddingVertical: 2 }}>{item.name}</Text>}
                keyExtractor={(item) => item.id} // ensure unique keys
                style={{ marginBottom: 15 }}
            />

            <TextInput
                placeholder="Type a message"
                value={input}
                onChangeText={setInput}
                style={{ borderWidth: 1, marginVertical: 5, padding: 8, borderRadius: 5 }}
            />
            <Button
                title="Send"
                onPress={() => {
                    if (input.trim()) {
                        sendMessage(input.trim());
                        setInput("");
                    }
                }}
            />

            <Text style={{ marginTop: 15, fontWeight: "bold" }}>Messages:</Text>
            <FlatList
                data={messages}
                renderItem={({ item }) => <Text style={{ paddingVertical: 2 }}>{item}</Text>}
                keyExtractor={(_, i) => i.toString()}
            />
        </View>
    );
}
