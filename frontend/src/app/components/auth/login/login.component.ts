import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    login() {
        this.http.post<any>('http://localhost:8080/api/auth/login', { username: this.username, password: this.password })
            .subscribe({
                next: (response) => {
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('user', JSON.stringify(response.user));
                    }
                    this.router.navigate(['/']);
                },
                error: () => {
                    this.error = 'Invalid credentials';
                }
            });
    }
}
