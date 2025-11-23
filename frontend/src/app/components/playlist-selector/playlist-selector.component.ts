import { Component, EventEmitter, Input, Output, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-playlist-selector',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './playlist-selector.component.html',
})
export class PlaylistSelectorComponent implements OnInit {
    @Input() songId: number | null = null;
    @Output() close = new EventEmitter<void>();

    playlists: any[] = [];
    username: string = '';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                this.username = user.username;
                this.fetchPlaylists();
            }
        }
    }

    fetchPlaylists() {
        this.http.get<any[]>(`http://localhost:8080/api/playlists?username=${this.username}`)
            .subscribe(playlists => {
                this.playlists = playlists;
            });
    }

    addToPlaylist(playlistId: number) {
        if (!this.songId) return;

        this.http.post(`http://localhost:8080/api/playlists/${playlistId}/songs/${this.songId}`, {})
            .subscribe(() => {
                alert('Song added to playlist!');
                this.close.emit();
            });
    }
}
