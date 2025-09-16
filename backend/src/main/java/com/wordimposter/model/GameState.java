package com.wordimposter.model;

public enum GameState {
    WAITING,    // Waiting for players to join
    STARTING,   // Game is about to start
    PLAYING,    // Game is in progress
    VOTING,     // Players are voting
    FINISHED    // Game has ended
}