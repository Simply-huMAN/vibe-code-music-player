import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-library',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit {
    playlists: any[] = [];
    likedSongs: any[] = [];
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
                this.likedSongs = user.likedSongs || [];
            }
        }
    }

    fetchPlaylists() {
        this.http.get<any[]>(`http://localhost:8080/api/playlists?username=${this.username}`)
            .subscribe(playlists => {
                this.playlists = playlists;
            });
    }

    createPlaylist() {
        if (!this.username) {
            alert('Please login to create a playlist');
            return;
        }
        const name = prompt('Enter playlist name:');
        if (!name) return;

        this.http.post('http://localhost:8080/api/playlists', {
            username: this.username,
            name: name,
            description: 'Created via Web'
        }).subscribe(() => {
            this.fetchPlaylists();
        });
    }
}
