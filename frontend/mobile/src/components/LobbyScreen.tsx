import React from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import {Game, Player} from '../types';

type LobbyScreenProps = {
    game: Game;
    playerId: string;
    onReady: () => void;
    onStart: () => void;
};

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
                                                            game,
                                                            playerId,
                                                            onReady,
                                                            onStart,
                                                        }) => {
    const currentPlayer = game.players.find(p => p.id === playerId);
    console.log('Current Player:', currentPlayer);

    const allPlayersReady = game.players.every(p => p.isReady);
    console.log('All Players Ready:', allPlayersReady);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Code: {game.code}</Text>
            <FlatList
                data={game.players}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.playerItem}>
                        <Text>{item.name}</Text>
                        {item.isReady && <Text style={styles.readyText}>Ready!</Text>}
                    </View>
                )}
            />
            {!currentPlayer?.isReady && (
                <Button title="I'm Ready" onPress={onReady}/>
            )}
            {allPlayersReady && game.players.length >= 3 && (
                <Button title="Start Game" onPress={onStart}/>
            )}
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
        marginBottom: 20,
    },
    playerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    readyText: {
        color: 'green',
    },
});