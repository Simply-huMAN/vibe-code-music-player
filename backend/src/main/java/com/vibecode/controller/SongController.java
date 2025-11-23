package com.vibecode.controller;

import com.vibecode.model.Song;
import com.vibecode.repository.SongRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular frontend
public class SongController {

    @Autowired
    private SongRepository songRepository;

    @PostConstruct
    public void init() {
        // Seed some data
        if (songRepository.count() == 0) {
            songRepository.save(new Song("Midnight City", "M83", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"));
            songRepository.save(new Song("Starlight", "Muse", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"));
            songRepository.save(new Song("Get Lucky", "Daft Punk", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"));
            songRepository.save(new Song("Nightcall", "Kavinsky", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", "https://images.unsplash.com/photo-1514525253440-b393452e3383?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"));
            songRepository.save(new Song("Drive", "The Cars", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", "https://images.unsplash.com/photo-1459749411177-287ce1465101?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"));
        }
    }

    @GetMapping
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    @GetMapping("/search")
    public List<Song> searchSongs(@org.springframework.web.bind.annotation.RequestParam String query) {
        return songRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(query, query);
    }

    @Autowired
    private com.vibecode.repository.UserRepository userRepository;

    @PostMapping("/{id}/like")
    public org.springframework.http.ResponseEntity<?> likeSong(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        java.util.Optional<Song> songOpt = songRepository.findById(id);
        java.util.Optional<com.vibecode.model.User> userOpt = userRepository.findByUsername(payload.get("username"));

        if (songOpt.isPresent() && userOpt.isPresent()) {
            com.vibecode.model.User user = userOpt.get();
            com.vibecode.model.Song song = songOpt.get();
            
            if (user.getLikedSongs().contains(song)) {
                user.getLikedSongs().remove(song);
            } else {
                user.getLikedSongs().add(song);
            }
            userRepository.save(user);
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("liked", user.getLikedSongs().contains(song)));
        }
        return org.springframework.http.ResponseEntity.badRequest().body("User or Song not found");
    }
    @Autowired
    private com.vibecode.repository.TagRepository tagRepository;

    @PostMapping("/{id}/tags")
    public org.springframework.http.ResponseEntity<?> addTag(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        java.util.Optional<Song> songOpt = songRepository.findById(id);
        String tagName = payload.get("name");

        if (songOpt.isPresent() && tagName != null && !tagName.trim().isEmpty()) {
            Song song = songOpt.get();
            com.vibecode.model.Tag tag = tagRepository.findByName(tagName)
                .orElseGet(() -> tagRepository.save(new com.vibecode.model.Tag(tagName)));
            
            if (!song.getTags().contains(tag)) {
                song.getTags().add(tag);
                songRepository.save(song);
            }
            return org.springframework.http.ResponseEntity.ok(song);
        }
        return org.springframework.http.ResponseEntity.badRequest().body("Song not found or invalid tag name");
    }
}
