import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AudioService } from '../../services/audio.service';
import { PlaylistSelectorComponent } from '../playlist-selector/playlist-selector.component';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-song-player',
    standalone: true,
    imports: [CommonModule, HttpClientModule, PlaylistSelectorComponent, FormsModule],
    templateUrl: './song-player.component.html',
    styles: [`
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin 8s linear infinite;
    }
    .paused {
      animation-play-state: paused;
    }
  `]
})
export class SongPlayerComponent implements OnInit {
    song: any = null;
    isPlaying = false;
    showLyrics = false;
    isLiked = false;
    showPlaylistModal = false;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private audioService: AudioService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.audioService.isPlaying$.subscribe(playing => this.isPlaying = playing);
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.fetchSong(id);
        }
    }

    fetchSong(id: string) {
        this.http.get<any>(`http://localhost:8080/api/songs/${id}`).subscribe(song => {
            this.song = song;
            // Check if liked
            if (isPlatformBrowser(this.platformId)) {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    this.isLiked = user.likedSongs?.some((s: any) => s.id === song.id);
                }
            }
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioService.pause();
        } else {
            if (this.audioService.currentSong$.value?.id !== this.song.id) {
                this.audioService.playSong(this.song);
            } else {
                this.audioService.play();
            }
        }
    }

    toggleLike() {
        if (isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('Please login to like songs');
                return;
            }
            const user = JSON.parse(userStr);

            this.http.post(`http://localhost:8080/api/songs/${this.song.id}/like`, { username: user.username })
                .subscribe((res: any) => {
                    this.isLiked = res.liked;
                    // Update local user object to reflect change (simplified)
                    if (res.liked) {
                        user.likedSongs = [...(user.likedSongs || []), this.song];
                    } else {
                        user.likedSongs = user.likedSongs?.filter((s: any) => s.id !== this.song.id);
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                });
        }
    }

    addToPlaylist() {
        this.showPlaylistModal = true;
    }

    newTag: string = '';
    addTag() {
        if (!this.newTag.trim()) return;

        this.http.post<any>(`http://localhost:8080/api/songs/${this.song.id}/tags`, { name: this.newTag })
            .subscribe(updatedSong => {
                this.song = updatedSong;
                this.newTag = '';
            });
    }

    back() {
        this.router.navigate(['/']);
    }
}
