package com.vibecode.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "SONG")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String artist;
    private String url;
    private String coverUrl;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String lyrics;
    
    @ManyToMany
    @JoinTable(
        name = "song_tags",
        joinColumns = @JoinColumn(name = "song_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    public Song(String title, String artist, String url, String coverUrl) {
        this.title = title;
        this.artist = artist;
        this.url = url;
        this.coverUrl = coverUrl;
    }
}
