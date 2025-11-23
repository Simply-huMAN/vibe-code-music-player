import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private audio: HTMLAudioElement | null = null;

    public isPlaying$ = new BehaviorSubject<boolean>(false);
    public currentTime$ = new BehaviorSubject<number>(0);
    public duration$ = new BehaviorSubject<number>(0);
    public currentSong$ = new BehaviorSubject<any>(null);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.audio = new Audio();
            this.audio.ontimeupdate = () => {
                this.currentTime$.next(this.audio?.currentTime || 0);
            };
            this.audio.onloadedmetadata = () => {
                this.duration$.next(this.audio?.duration || 0);
            };
            this.audio.onended = () => {
                this.isPlaying$.next(false);
                this.currentTime$.next(0);
            };
        }
    }

    playStream(url: string) {
        if (!this.audio) return;
        this.audio.src = url;
        this.audio.load();
        this.play();
    }

    playSong(song: any) {
        this.playStream(song.url);
        this.currentSong$.next(song);
    }

    play() {
        if (!this.audio) return;
        this.audio.play();
        this.isPlaying$.next(true);
    }

    pause() {
        if (!this.audio) return;
        this.audio.pause();
        this.isPlaying$.next(false);
    }

    seekTo(seconds: number) {
        if (!this.audio) return;
        this.audio.currentTime = seconds;
    }

    setVolume(volume: number) {
        if (!this.audio) return;
        this.audio.volume = volume;
    }
}
