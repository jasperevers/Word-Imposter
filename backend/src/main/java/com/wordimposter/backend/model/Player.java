package com.wordimposter.backend.model;

public class Player {
    public String id;
    public String name;

    public Player(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // Optional: no-args constructor for JSON serialization
    public Player() {}
}
