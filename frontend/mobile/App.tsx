import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { LobbyScreen } from './src/components/LobbyScreen';
import { GameScreen } from './src/components/GameScreen';
import { GameWebSocket } from './src/services/websocket';
import { Game, Player } from './src/types';

export default function App() {
    const [gameCode, setGameCode] = useState<string | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [game, setGame] = useState<Game | null>(null);
    const [word, setWord] = useState<string>('');
    const [ws, setWs] = useState<GameWebSocket | null>(null);

    useEffect(() => {
        if (gameCode && playerId) {
            const websocket = new GameWebSocket(gameCode, playerId);
            websocket.onGameUpdate = (updatedGame) => {
                setGame(updatedGame);
                if (updatedGame.word) {
                    setWord(updatedGame.word);
                }
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

    const getCurrentPlayer = (): Player | undefined => {
        return game?.players.find(p => p.id === playerId);
    };

    const renderScreen = () => {
        if (!gameCode || !playerId || !game) {
            return <HomeScreen onJoinGame={handleJoinGame} />;
        }

        const currentPlayer = getCurrentPlayer();
        if (!currentPlayer) return null;

        if (game.state === 'WAITING') {
            return (
                <LobbyScreen
                    game={game}
                    playerId={playerId}
                    onReady={() => ws?.setReady()}
                    onStart={() => ws?.startGame()}
                />
            );
        }

        return (
            <GameScreen
                game={game}
                currentPlayer={currentPlayer}
                word={word}
                onVote={(votedId) => ws?.vote(votedId)}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderScreen()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});