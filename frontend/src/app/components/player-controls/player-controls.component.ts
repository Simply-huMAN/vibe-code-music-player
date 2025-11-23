import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

@Component({
    selector: 'app-player-controls',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './player-controls.component.html',
})
export class PlayerControlsComponent {
    constructor(public audioService: AudioService) { }

    togglePlay() {
        if (this.audioService.isPlaying$.value) {
            this.audioService.pause();
        } else {
            this.audioService.play();
        }
    }

    onSeek(event: any) {
        this.audioService.seekTo(event.target.value);
    }

    formatTime(time: number): string {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}
