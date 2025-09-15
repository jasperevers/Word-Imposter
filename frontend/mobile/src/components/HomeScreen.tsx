
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { api } from '../services/api';

type HomeScreenProps = {
    onJoinGame: (gameCode: string, playerId: string) => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onJoinGame }) => {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState('');

    const createGame = async () => {
        try {
            const { code } = await api.createLobby();
            const { playerId } = await api.joinLobby(code, name);
            onJoinGame(code, playerId);
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    const joinGame = async () => {
        try {
            const { playerId } = await api.joinLobby(gameCode, name);
            onJoinGame(gameCode, playerId);
        } catch (error) {
            console.error('Failed to join game:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Game code (for joining)"
                value={gameCode}
                onChangeText={setGameCode}
            />
            <View style={styles.buttonContainer}>
                <Button title="Create Game" onPress={createGame} />
                <Button title="Join Game" onPress={joinGame} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});