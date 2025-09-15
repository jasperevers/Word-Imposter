import {Player, GameState} from "../types";

const API_URL = 'http://localhost:8080/api';

export const api = {
    createLobby: async (): Promise<{ code: string }> => {
        const response = await fetch(`${API_URL}/lobby/create`, {
            method: 'POST',
        });
        return response.json();
    },

    joinLobby: async (code: string, name: string): Promise<{
        playerId: string;
        players: Player[];
        gameState: GameState;
    }> => {
        const response = await fetch(`${API_URL}/lobby/${code}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        return response.json();
    },
};