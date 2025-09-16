
export type Player = {
    id: string;
    name: string;
    isReady: boolean;
};

export type GameState = 'WAITING' | 'STARTING' | 'PLAYING' | 'VOTING' | 'FINISHED';

export type Game = {
    code: string;
    players: Player[];
    state: GameState;
};

export type Vote = {
    voterId: string;
    votedId: string;
};