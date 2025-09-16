
package com.wordimposter.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.wordimposter.controller.LobbyController;
import com.wordimposter.model.Game;
import com.wordimposter.model.GameState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameWebSocket extends TextWebSocketHandler {
    private final Map<String, Game> games;  // gameCode -> Game
    private final Map<WebSocketSession, String> sessionGameCodes;  // session -> gameCode
    private final Map<WebSocketSession, String> sessionPlayerIds;  // session -> playerId
    private final ObjectMapper objectMapper;

    @Autowired
    private LobbyController lobbyController;

    public GameWebSocket() {
        this.games = new ConcurrentHashMap<>();
        this.sessionGameCodes = new ConcurrentHashMap<>();
        this.sessionPlayerIds = new ConcurrentHashMap<>();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("New WebSocket connection established: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message: " + message.getPayload());
        Map<String, String> payload = objectMapper.readValue(message.getPayload(), Map.class);
        String action = payload.get("action");
        String gameCode = payload.get("gameCode");
        String playerId = payload.get("playerId");

        System.out.println("Processing action: " + action + " for game: " + gameCode + " player: " + playerId);

        Game game = games.get(gameCode);
        if (game == null && action.equals("join")) {
            // Try to get the game from the lobby controller
            game = lobbyController.getGame(gameCode);
            if (game != null) {
                System.out.println("Found game in lobby controller: " + gameCode);
                games.put(gameCode, game);
            }
        }

        if (game == null) {
            System.out.println("Game not found: " + gameCode);
            return;
        }

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
            default:
                System.out.println("Unknown action: " + action);
                break;
        }

        // Broadcast updated game state to all players
        broadcastGameState(game);
    }

    private void handleJoin(WebSocketSession session, String gameCode, String playerId) {
        System.out.println("Handling join for game: " + gameCode + ", player: " + playerId);
        sessionGameCodes.put(session, gameCode);
        sessionPlayerIds.put(session, playerId);

        Game game = games.get(gameCode);
        if (game != null) {
            try {
                String gameStateJson = objectMapper.writeValueAsString(game);
                session.sendMessage(new TextMessage(gameStateJson));
                System.out.println("Sent initial game state to player: " + gameStateJson);
            } catch (Exception e) {
                System.err.println("Error sending initial game state: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private void handleReady(Game game, String playerId) {
        System.out.println("Setting player ready: " + playerId);
        game.getPlayers().stream()
                .filter(p -> p.getId().equals(playerId))
                .findFirst()
                .ifPresent(p -> {
                    p.setReady(true);
                    System.out.println("Player " + playerId + " is now ready");
                });
    }

    private void handleStart(Game game) {
        System.out.println("Attempting to start game: " + game.getCode());
        if (game.getState() == GameState.WAITING) {
            game.startGame();
            System.out.println("Game started: " + game.getCode());
        } else {
            System.out.println("Cannot start game - not in WAITING state. Current state: " + game.getState());
        }
    }

    private void handleVote(Game game, String voterId, String votedId) {
        System.out.println("Processing vote - voter: " + voterId + ", voted for: " + votedId);
        if (game.getState() == GameState.PLAYING) {
            game.vote(voterId, votedId);
            System.out.println("Vote registered successfully");
        } else {
            System.out.println("Cannot vote - game not in PLAYING state. Current state: " + game.getState());
        }
    }

    private void broadcastGameState(Game game) {
        try {
            String gameStateJson = objectMapper.writeValueAsString(game);
            System.out.println("Broadcasting game state: " + gameStateJson);
            TextMessage message = new TextMessage(gameStateJson);

            sessionGameCodes.entrySet().stream()
                    .filter(entry -> entry.getValue().equals(game.getCode()))
                    .map(Map.Entry::getKey)
                    .forEach(session -> {
                        try {
                            if (session.isOpen()) {
                                session.sendMessage(message);
                                System.out.println("Sent game state to session: " + session.getId());
                            } else {
                                System.out.println("Session closed, cannot send message: " + session.getId());
                            }
                        } catch (IOException e) {
                            System.err.println("Error broadcasting game state to session " + session.getId() + ": " + e.getMessage());
                            e.printStackTrace();
                        }
                    });
        } catch (JsonProcessingException e) {
            System.err.println("Error serializing game state: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        System.out.println("WebSocket connection closed: " + session.getId() + " with status: " + status);
        String gameCode = sessionGameCodes.remove(session);
        String playerId = sessionPlayerIds.remove(session);
        System.out.println("Cleaned up session data for game: " + gameCode + ", player: " + playerId);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        System.err.println("WebSocket transport error for session " + session.getId() + ": " + exception.getMessage());
        exception.printStackTrace();
    }
}