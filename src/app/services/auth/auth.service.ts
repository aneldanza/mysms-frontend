import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface DecodedJWT {
  email?: string;
  username?: string;
  jti?: string;
  exp: number;
  // any other fields you included in your token
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.baseApi;
  private tokenKey = environment.tokenKey;

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
    const user = this.getUser();
    if (!user) return false;
    const expirationDate = new Date(user.exp * 1000);
    return expirationDate > new Date();
  }

  getUser(): DecodedJWT | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedJWT>(token);
    } catch (err) {
      console.error('Invalid JWT:', err);
      return null;
    }
  }
}
