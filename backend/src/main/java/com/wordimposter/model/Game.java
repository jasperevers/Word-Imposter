package com.wordimposter.model;

import java.util.*;

public class Game {
    private String code;
    private List<Player> players;
    private String word;
    private String imposterWord;
    private String imposterId;
    private GameState state;
    private Map<String, String> votes;  // playerId -> votedPlayerId

    public Game(String code) {
        this.code = code;
        this.players = new ArrayList<>();
        this.state = GameState.WAITING;
        this.votes = new HashMap<>();
    }

    public void addPlayer(Player player) {
        players.add(player);
    }

    public void removePlayer(String playerId) {
        players.removeIf(p -> p.getId().equals(playerId));
    }

    public void startGame() {
        if (players.size() < 3) {
            throw new IllegalStateException("Need at least 3 players to start");
        }

        // Select random imposter
        Random random = new Random();
        Player imposter = players.get(random.nextInt(players.size()));
        this.imposterId = imposter.getId();

        // TODO: Replace with actual word lists
        List<String> regularWords = Arrays.asList("DOG", "CAT", "BIRD", "FISH");
        List<String> imposterWords = Arrays.asList("PET", "ANIMAL", "CREATURE", "BEAST");

        this.word = regularWords.get(random.nextInt(regularWords.size()));
        this.imposterWord = imposterWords.get(random.nextInt(imposterWords.size()));

        this.state = GameState.PLAYING;
        this.votes.clear();
    }

    public void vote(String voterId, String votedId) {
        votes.put(voterId, votedId);

        // Check if everyone has voted
        if (votes.size() == players.size()) {
            calculateVoteResults();
        }
    }

    private void calculateVoteResults() {
        // Count votes for each player
        Map<String, Integer> voteCounts = new HashMap<>();
        for (String votedId : votes.values()) {
            voteCounts.merge(votedId, 1, Integer::sum);
        }

        // Find player with most votes
        String mostVotedId = Collections.max(voteCounts.entrySet(), Map.Entry.comparingByValue()).getKey();

        // Game ends, imposter wins if not caught, others win if imposter is caught
        this.state = GameState.FINISHED;
    }

    // Getters
    public String getCode() { return code; }
    public List<Player> getPlayers() { return players; }
    public GameState getState() { return state; }
    public String getWordForPlayer(String playerId) {
        return playerId.equals(imposterId) ? imposterWord : word;
    }
    public boolean isImposter(String playerId) {
        return playerId.equals(imposterId);
    }
    public Map<String, String> getVotes() { return votes; }
}