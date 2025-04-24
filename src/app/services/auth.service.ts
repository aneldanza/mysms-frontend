import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'sms_messenger_jwt';

  constructor(private http: HttpClient, private router: Router) {}

  signUp(data: any) {
    return this.http.post(`${this.apiUrl}/users`, { user: data }).pipe(
      tap((response: any) => {
        this.handleToken(response);
      })
    );
  }

  signIn(data: any) {
    return this.http.post(`${this.apiUrl}/users/sign_in`, { user: data }).pipe(
      tap((response: any) => {
        this.handleToken(response);
      })
    );
  }

  logOut() {
    return this.http.delete(`${this.apiUrl}/users/sign_out`).pipe(
      tap(() => {
        this.clearToken();
      })
    );
  }

  handleToken(res: any) {
    const token = res?.headers?.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate > new Date();
  }
}
