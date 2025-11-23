import { Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list.component';
import { BrowseComponent } from './components/browse/browse.component';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LibraryComponent } from './components/library/library.component';
import { SongPlayerComponent } from './components/song-player/song-player.component';

export const routes: Routes = [
    { path: '', component: SongListComponent },
    { path: 'browse', component: BrowseComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'library', component: LibraryComponent },
    { path: 'player/:id', component: SongPlayerComponent },
    { path: '**', redirectTo: '' }
];
