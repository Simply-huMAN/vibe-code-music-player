import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AudioService } from '../../services/audio.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-browse',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './browse.component.html',
})
export class BrowseComponent implements OnInit {
    songs: any[] = [];
    private searchTerms = new Subject<string>();

    constructor(private http: HttpClient, private audioService: AudioService) { }

    ngOnInit() {
        // Initial load
        this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((term: string) => {
                if (!term.trim()) {
                    return this.http.get<any[]>('http://localhost:8080/api/songs');
                }
                return this.http.get<any[]>(`http://localhost:8080/api/songs/search?query=${term}`);
            })
        ).subscribe(songs => this.songs = songs);

        // Trigger initial load
        this.search('');
    }

    search(term: string): void {
        this.searchTerms.next(term);
    }

    playSong(song: any) {
        this.audioService.playStream(song.url);
        this.audioService.currentSong$.next(song);
    }
}
