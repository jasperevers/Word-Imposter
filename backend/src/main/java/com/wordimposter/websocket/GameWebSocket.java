package com.wordimposter.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wordimposter.model.Game;
import com.wordimposter.model.GameState;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameWebSocket extends TextWebSocketHandler {
    private final Map<String, Game> games;  // gameCode -> Game
    private final Map<WebSocketSession, String> sessionGameCodes;  // session -> gameCode
    private final Map<WebSocketSession, String> sessionPlayerIds;  // session -> playerId
    private final ObjectMapper objectMapper;

    public GameWebSocket() {
        this.games = new ConcurrentHashMap<>();
        this.sessionGameCodes = new ConcurrentHashMap<>();
        this.sessionPlayerIds = new ConcurrentHashMap<>();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, String> payload = objectMapper.readValue(message.getPayload(), Map.class);
        String action = payload.get("action");
        String gameCode = payload.get("gameCode");
        String playerId = payload.get("playerId");

        Game game = games.get(gameCode);
        if (game == null) return;

        switch (action) {
            case "join":
                handleJoin(session, gameCode, playerId);
                break;
            case "ready":
                handleReady(game, playerId);
                break;
            case "start":
                handleStart(game);
                break;
            case "vote":
                handleVote(game, playerId, payload.get("votedId"));
                break;
        }

        // Broadcast updated game state to all players
        broadcastGameState(game);
    }

    private void handleJoin(WebSocketSession session, String gameCode, String playerId) {
        sessionGameCodes.put(session, gameCode);
        sessionPlayerIds.put(session, playerId);
    }

    private void handleReady(Game game, String playerId) {
        game.getPlayers().stream()
            .filter(p -> p.getId().equals(playerId))
            .findFirst()
            .ifPresent(p -> p.setReady(true));
    }

    private void handleStart(Game game) {
        if (game.getState() == GameState.WAITING) {
            game.startGame();
        }
    }

    private void handleVote(Game game, String voterId, String votedId) {
        if (game.getState() == GameState.PLAYING) {
            game.vote(voterId, votedId);
        }
    }

    private void broadcastGameState(Game game) {
        // Implement broadcasting game state to all connected players
    }
}
