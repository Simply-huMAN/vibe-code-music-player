import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-song-list',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './song-list.component.html',
})
export class SongListComponent implements OnInit {
    songs: any[] = [];
    likedSongIds: Set<number> = new Set();

    constructor(
        private audioService: AudioService,
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.http.get<any[]>('http://localhost:8080/api/songs').subscribe(songs => {
            this.songs = songs;
            this.checkLikes();
        });
    }

    playSong(song: any) {
        this.router.navigate(['/player', song.id]);
    }

    checkLikes() {
        if (isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;
            const user = JSON.parse(userStr);
            if (user.likedSongs) {
                user.likedSongs.forEach((s: any) => this.likedSongIds.add(s.id));
            }
        }
    }

    isLiked(song: any): boolean {
        return this.likedSongIds.has(song.id);
    }

    toggleLike(song: any, event: Event) {
        event.stopPropagation();
        if (!isPlatformBrowser(this.platformId)) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to like songs');
            return;
        }
        const user = JSON.parse(userStr);

        this.http.post(`http://localhost:8080/api/songs/${song.id}/like`, { username: user.username })
            .subscribe((res: any) => {
                if (res.liked) {
                    this.likedSongIds.add(song.id);
                } else {
                    this.likedSongIds.delete(song.id);
                }
            });
    }

    addToPlaylist(song: any, event: Event) {
        event.stopPropagation();
        alert('Add to playlist feature coming soon! (Backend ready)');
    }
}
