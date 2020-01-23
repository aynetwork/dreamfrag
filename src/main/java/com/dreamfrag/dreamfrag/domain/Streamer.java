package com.dreamfrag.dreamfrag.domain;

import org.springframework.lang.Nullable;

import javax.persistence.*;

@Entity
@Table(name = "streamer")
public class Streamer {
    @Id
//    @SequenceGenerator(name = "user_seq", sequenceName = "user_user_id_seq", allocationSize = 0)
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    private String name;

    private String youtube_channel;

    private boolean game = false;

    @Column(name="category",nullable=true)
    private Long category;

    @Column(name="last_video", nullable=true, columnDefinition = "integer default 1")
    private Long last_video;

    public Streamer() {
    }

    public String getYoutube_channel() {
        return youtube_channel;
    }

    public void setYoutube_channel(String youtube_channel) {
        this.youtube_channel = youtube_channel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isGame() {
        return game;
    }

    public void setGame(boolean game) {
        this.game = game;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long category) {
        this.category = category;
    }

    public Long getLast_video() {
        return last_video;
    }

    public void setLast_video(Long last_video) {
        this.last_video = last_video;
    }
}
