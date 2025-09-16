
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
        console.log('Initializing WebSocket connection...');
        console.log('Game Code:', gameCode);
        console.log('Player ID:', playerId);

        this.gameCode = gameCode;
        this.playerId = playerId;

        // Initialize WebSocket connection
        this.ws = new WebSocket('ws://192.168.2.29:8080/game-ws');
        console.log('WebSocket state after creation:', this.ws.readyState);

        this.ws.onopen = () => {
            console.log('WebSocket connection established');
            this.sendMessage({
                action: 'join',
                gameCode: this.gameCode,
                playerId: this.playerId
            });
        };

        this.ws.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);
            try {
                const data = JSON.parse(event.data);
                console.log('Parsed message data:', data);
                if (this.onGameUpdate) {
                    this.onGameUpdate(data);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                if (this.onError) {
                    this.onError('Failed to parse game update');
                }
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (this.onError) {
                this.onError('WebSocket connection error');
            }
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket connection closed');
            console.log('Close code:', event.code);
            console.log('Close reason:', event.reason);
        };
    }

    setReady() {
        console.log('Setting player ready state');
        this.sendMessage({
            action: 'ready',
            gameCode: this.gameCode,
            playerId: this.playerId
        });
    }

    startGame() {
        console.log('Sending start game request');
        this.sendMessage({
            action: 'start',
            gameCode: this.gameCode,
            playerId: this.playerId
        });
    }

    vote(votedId: string) {
        console.log('Sending vote for player:', votedId);
        this.sendMessage({
            action: 'vote',
            gameCode: this.gameCode,
            playerId: this.playerId,
            votedId
        });
    }

    private sendMessage(message: WebSocketMessage) {
        console.log('Attempting to send message:', message);
        console.log('Current WebSocket state:', this.ws.readyState);

        if (this.ws.readyState === WebSocket.OPEN) {
            const messageString = JSON.stringify(message);
            console.log('Sending message:', messageString);
            this.ws.send(messageString);
        } else {
            console.warn('WebSocket is not open. Current state:', this.ws.readyState);
            switch (this.ws.readyState) {
                case WebSocket.CONNECTING:
                    console.log('WebSocket is still connecting...');
                    break;
                case WebSocket.CLOSING:
                    console.log('WebSocket is closing...');
                    break;
                case WebSocket.CLOSED:
                    console.log('WebSocket is closed');
                    break;
            }
        }
    }

    disconnect() {
        console.log('Disconnecting WebSocket');
        if (this.ws) {
            this.ws.close();
        }
    }

    // Utility method to get connection state
    getConnectionState(): string {
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'CONNECTING';
            case WebSocket.OPEN:
                return 'OPEN';
            case WebSocket.CLOSING:
                return 'CLOSING';
            case WebSocket.CLOSED:
                return 'CLOSED';
            default:
                return 'UNKNOWN';
        }
    }

    // Method to check if connection is open
    isConnected(): boolean {
        return this.ws.readyState === WebSocket.OPEN;
    }

    // Method to reconnect if needed
    reconnect() {
        console.log('Attempting to reconnect...');
        if (this.ws.readyState === WebSocket.CLOSED) {
            console.log('Creating new WebSocket connection');
            this.ws = new WebSocket('ws://192.168.2.29:8080/game');
            // Reattach event handlers
            this.setupEventHandlers();
        } else {
            console.log('Cannot reconnect - WebSocket is not closed');
            console.log('Current WebSocket state:', this.getConnectionState());
        }
    }

    private setupEventHandlers() {
        this.ws.onopen = () => {
            console.log('WebSocket reconnection established');
            this.sendMessage({
                action: 'join',
                gameCode: this.gameCode,
                playerId: this.playerId
            });
        };

        this.ws.onmessage = (event) => {
            console.log('Received WebSocket message:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (this.onGameUpdate) {
                    this.onGameUpdate(data);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                if (this.onError) {
                    this.onError('Failed to parse game update');
                }
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error during reconnection:', error);
            if (this.onError) {
                this.onError('WebSocket reconnection error');
            }
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket reconnection closed');
            console.log('Close code:', event.code);
            console.log('Close reason:', event.reason);
        };
    }
}