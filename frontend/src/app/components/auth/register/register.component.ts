import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    username = '';
    password = '';
    email = '';
    error = '';

    constructor(private http: HttpClient, private router: Router) { }

    register() {
        this.http.post<any>('http://localhost:8080/api/auth/register', {
            username: this.username,
            password: this.password,
            email: this.email
        }).subscribe({
            next: () => {
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.error = err.error?.message || 'Registration failed';
            }
        });
    }
}
