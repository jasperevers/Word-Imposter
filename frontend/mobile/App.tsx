import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { LobbyScreen } from './src/components/LobbyScreen';
import { GameWebSocket } from './src/services/websocket';
import { Game } from './src/types';

export default function App() {
    const [gameCode, setGameCode] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [ws, setWs] = useState<GameWebSocket | null>(null);

    useEffect(() => {
        if (gameCode && playerId) {
            const websocket = new GameWebSocket(gameCode, playerId);
            websocket.onGameUpdate = (updatedGame) => {
                setGame(updatedGame);
            };
            setWs(websocket);

            return () => {
                websocket.disconnect();
            };
        }
    }, [gameCode, playerId]);

    const handleJoinGame = (code: string, pid: string) => {
        setGameCode(code);
        setPlayerId(pid);
    };

    return (
        <SafeAreaView style={styles.container}>
            {!gameCode || !playerId ? (
                <HomeScreen onJoinGame={handleJoinGame} />
            ) : (
                game && (
                    <LobbyScreen
                        game={game}
                        playerId={playerId}
                        onReady={() => ws?.setReady()}
                        onStart={() => ws?.startGame()}
                    />
                )
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});