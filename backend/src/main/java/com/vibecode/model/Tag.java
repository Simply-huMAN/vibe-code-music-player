package com.vibecode.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String name;
    
    @ManyToMany(mappedBy = "tags")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Song> songs;

    public Tag(String tagName) {
        this.name = tagName;
    }
}
