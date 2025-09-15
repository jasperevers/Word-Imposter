package com.wordimposter.controller;

import com.wordimposter.model.Game;
import com.wordimposter.model.Player;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/lobby")
@CrossOrigin(origins = "*")
public class LobbyController {
    private final Map<String, Game> games = new HashMap<>();

    @PostMapping("/create")
    public Map<String, String> createLobby() {
        String code = generateGameCode();
        games.put(code, new Game(code));
        return Map.of("code", code);
    }

    @PostMapping("/{code}/join")
    public Map<String, Object> joinLobby(@PathVariable String code, @RequestBody Map<String, String> body) {
        String playerName = body.get("name");
        Game game = games.get(code);
        
        if (game == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found");
        }

        String playerId = UUID.randomUUID().toString();
        Player player = new Player(playerId, playerName);
        game.addPlayer(player);

        return Map.of(
            "playerId", playerId,
            "players", game.getPlayers(),
            "gameState", game.getState()
        );
    }

    private String generateGameCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
