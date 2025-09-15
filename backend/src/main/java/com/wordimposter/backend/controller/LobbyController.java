package com.wordimposter.backend.controller;

import com.wordimposter.backend.model.Player;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/lobby")
@CrossOrigin(origins = "*")
public class LobbyController {

    // Now storing Player objects instead of strings
    private final Map<String, List<Player>> lobbies = new HashMap<>();

    // Create a new lobby
    @PostMapping
    public Map<String, String> createLobby() {
        String code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        lobbies.put(code, new ArrayList<>());
        return Map.of("code", code);
    }

    // Join a lobby
    @PostMapping("/{code}/join")
    public Map<String, Object> joinLobby(@PathVariable String code, @RequestBody Map<String, String> body) {
        String name = body.get("name");

        // Generate unique ID for the player
        String id = UUID.randomUUID().toString();
        Player player = new Player(id, name);

        // Initialize lobby if it doesn't exist
        lobbies.putIfAbsent(code, new ArrayList<>());

        // Add player to the lobby
        lobbies.get(code).add(player);

        return Map.of("players", lobbies.get(code));
    }
}
