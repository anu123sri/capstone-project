import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../authservice';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,

    // ✅ Angular Material modules used in HTML
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);

        const role = this.authService.getRole();

        if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/users']);
        } else if (role === 'ROLE_RELATIONSHIP_MANAGER') {
          this.router.navigate(['/rm']);
        } else if (role === 'ROLE_ANALYST') {
          this.router.navigate(['/analyst/credits']);
        } else {
          this.errorMessage = 'Unknown user role';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid username or password';
        console.error('Login error:', err);
      }
    });
  }
}
