package com.vibecode.controller;

import com.vibecode.model.Playlist;
import com.vibecode.model.Song;
import com.vibecode.model.User;
import com.vibecode.repository.PlaylistRepository;
import com.vibecode.repository.SongRepository;
import com.vibecode.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:4200")
public class PlaylistController {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SongRepository songRepository;

    @GetMapping
    public List<Playlist> getUserPlaylists(@RequestParam String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(value -> playlistRepository.findByUser(value)).orElse(List.of());
    }

    @PostMapping
    public ResponseEntity<?> createPlaylist(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String name = payload.get("name");
        String description = payload.get("description");

        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Playlist playlist = new Playlist();
            playlist.setName(name);
            playlist.setDescription(description);
            playlist.setUser(user.get());
            playlistRepository.save(playlist);
            return ResponseEntity.ok(playlist);
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    @PostMapping("/{id}/songs/{songId}")
    public ResponseEntity<?> addSongToPlaylist(@PathVariable Long id, @PathVariable Long songId) {
        Optional<Playlist> playlistOpt = playlistRepository.findById(id);
        Optional<Song> songOpt = songRepository.findById(songId);

        if (playlistOpt.isPresent() && songOpt.isPresent()) {
            Playlist playlist = playlistOpt.get();
            playlist.getSongs().add(songOpt.get());
            playlistRepository.save(playlist);
            return ResponseEntity.ok(playlist);
        }
        return ResponseEntity.badRequest().body("Playlist or Song not found");
    }
}
