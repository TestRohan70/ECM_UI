import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface LoginRequest {
  userName: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private http   = inject(HttpClient);
  private router = inject(Router);

  isLoading     = false;
  showPassword  = false;
  errorMessage  = '';

  loginModel: LoginRequest = {
    userName: '',
    password: ''
  };

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.errorMessage = '';

    if (!this.loginModel.userName || !this.loginModel.password) {
      this.errorMessage = 'Please enter your username and password.';
      return;
    }

    this.isLoading = true;

    this.http.post<LoginResponse>(
      'https://localhost:7075/api/Auth/login',
      this.loginModel
    ).subscribe({

      next: (response: LoginResponse) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your network.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }

    });
  }
}
