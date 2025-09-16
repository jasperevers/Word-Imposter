import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';

type HomeScreenProps = {
    onJoinGame: (gameCode: string, playerId: string) => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onJoinGame }) => {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const createGame = async () => {
        if (!name) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Creating game...');
            const { code } = await api.createLobby();
            console.log('Game created with code:', code);

            console.log('Joining created game...');
            const { playerId } = await api.joinLobby(code, name);
            console.log('Joined game with playerId:', playerId);

            onJoinGame(code, playerId);
        } catch (error) {
            console.error('Failed to create/join game:', error);
            Alert.alert('Error', 'Failed to create game. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const joinGame = async () => {
        if (!name || !gameCode) {
            Alert.alert('Error', 'Please enter your name and game code');
            return;
        }

        setIsLoading(true);
        try {
            const { playerId } = await api.joinLobby(gameCode, name);
            onJoinGame(gameCode, playerId);
        } catch (error) {
            console.error('Failed to join game:', error);
            Alert.alert('Error', 'Failed to join game. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
            />
            <TextInput
                style={styles.input}
                placeholder="Game code (for joining)"
                value={gameCode}
                onChangeText={setGameCode}
                editable={!isLoading}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Create Game"
                    onPress={createGame}
                    disabled={isLoading}
                />
                <Button
                    title="Join Game"
                    onPress={joinGame}
                    disabled={isLoading || !gameCode}
                />
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