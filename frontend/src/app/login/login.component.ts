import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';

  password = '';

  errorMessage = '';

  loading = false;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  login() {

    this.errorMessage = '';

    this.loading = true;

    this.authService.login(
        this.email,
        this.password
    ).subscribe({

      next: (user) => {

        this.loading = false;

        if (user) {

          this.router.navigate(['/dashboard']);
        } else {

          this.errorMessage =
              'Email ou mot de passe incorrect';
        }
      },

      error: () => {

        this.loading = false;

        this.errorMessage =
            'Erreur serveur';
      }
    });
  }
}