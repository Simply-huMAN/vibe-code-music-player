import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { PlayerControlsComponent } from './components/player-controls/player-controls.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PlayerControlsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'vibe-code';
  isLoggedIn = false;
  username = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkLogin();
    // Listen to storage events to update state across tabs or after login
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', () => this.checkLogin());
      // Also check periodically or use a service (simplified here)
      setInterval(() => this.checkLogin(), 1000);
    }
  }

  checkLogin() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem('user');
      this.isLoggedIn = !!userStr;
      if (this.isLoggedIn) {
        this.username = JSON.parse(userStr!).username;
      }
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.username = '';
      this.router.navigate(['/login']);
    }
  }
}
