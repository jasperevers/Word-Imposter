
import { Game, Player } from '../types';

type WebSocketMessage = {
    action: string;
    gameCode: string;
    playerId?: string;
    votedId?: string;
};

export class GameWebSocket {
    private ws: WebSocket;
    private gameCode: string;
    private playerId: string;

    onGameUpdate?: (game: Game) => void;
    onError?: (error: string) => void;

    constructor(gameCode: string, playerId: string) {
        this.gameCode = gameCode;
        this.playerId = playerId;
        this.ws = new WebSocket('ws://localhost:8080/game-ws');

        this.ws.onopen = () => {
            this.sendMessage({
                action: 'join',
                gameCode: this.gameCode,
                playerId: this.playerId
            });
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.onGameUpdate) {
                this.onGameUpdate(data);
            }
        };

        this.ws.onerror = () => {
            if (this.onError) {
                this.onError('WebSocket connection error');
            }
        };
    }

    setReady() {
        this.sendMessage({
            action: 'ready',
            gameCode: this.gameCode,
            playerId: this.playerId
        });
    }

    startGame() {
        this.sendMessage({
            action: 'start',
            gameCode: this.gameCode,
            playerId: this.playerId
        });
    }

    vote(votedId: string) {
        this.sendMessage({
            action: 'vote',
            gameCode: this.gameCode,
            playerId: this.playerId,
            votedId
        });
    }

    private sendMessage(message: WebSocketMessage) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    disconnect() {
        this.ws.close();
    }
}