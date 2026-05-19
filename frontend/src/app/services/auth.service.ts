import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(email: string, password: string): Observable<any> {

    return this.http.post<any>(
        `${this.apiUrl}/login`,
        {
          email,
          password
        }
    ).pipe(

        tap(user => {

          // Sauvegarde utilisateur connecté
          localStorage.setItem(
              'user',
              JSON.stringify(user)
          );
        })
    );
  }

  // USER CONNECTÉ
  getUser() {

    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }

  // EST CONNECTÉ
  isLoggedIn(): boolean {

    return !!localStorage.getItem('user');
  }

  // LOGOUT
  logout() {

    localStorage.removeItem('user');
  }
}