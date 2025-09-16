
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Game, Player } from '../types';

type GameScreenProps = {
    game: Game;
    currentPlayer: Player;
    word: string;
    onVote: (playerId: string) => void;
};

export const GameScreen: React.FC<GameScreenProps> = ({
                                                          game,
                                                          currentPlayer,
                                                          word,
                                                          onVote
                                                      }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Word</Text>
            <Text style={styles.word}>{word}</Text>

            <Text style={styles.subtitle}>Players:</Text>
            {game.players.map((player) => (
                <View key={player.id} style={styles.playerRow}>
                    <Text>{player.name}</Text>
                    {game.state === 'VOTING' && player.id !== currentPlayer.id && (
                        <Button
                            title="Vote"
                            onPress={() => onVote(player.id)}
                        />
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
    },
    word: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        padding: 20,
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});