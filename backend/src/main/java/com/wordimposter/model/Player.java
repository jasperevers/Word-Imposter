package com.wordimposter.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Player {
    private String id;
    private String name;

    @JsonProperty("isReady")
    private boolean isReady;

    public Player(String id, String name) {
        this.id = id;
        this.name = name;
        this.isReady = false;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isReady() { return isReady; }
    public void setReady(boolean ready) { isReady = ready; }
}