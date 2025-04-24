import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  jti: string;
  exp: number;
  scp: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.baseApi;
  private tokenKey = environment.tokenKey;
  private decodedTokenSubject = new BehaviorSubject<DecodedToken | null>(null);
  decodedToken$ = this.decodedTokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) this.setInfoFromToken(token);
  }

  setInfoFromToken(token: string) {
    try {
      const info = jwtDecode<DecodedToken>(token);
      this.decodedTokenSubject.next(info);
    } catch (err) {
      console.error('Invalid JWT:', err);
      this.decodedTokenSubject.next(null);
    }
  }

  signUp(data: any) {
    return this.http
      .post(`${this.apiUrl}/users`, { user: data }, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          this.handleToken(response);
        })
      );
  }

  signIn(data: any) {
    return this.http
      .post(
        `${this.apiUrl}/users/sign_in`,
        { user: data },
        { observe: 'response' }
      )
      .pipe(
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
    const token = res.headers?.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      this.setToken(token);
    } else {
      console.warn('No JWT token found in Authorization header');
    }
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    this.decodedTokenSubject.next(null);
    this.router.navigate(['/sign-in']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.setInfoFromToken(token);
  }

  isLoggedIn() {
    const user = this.getUser();
    return !!user && !this.tokenExpired();
  }

  tokenExpired() {
    const user = this.getUser();
    if (!user?.exp) return true;
    return new Date(user.exp * 1000) <= new Date();
  }

  getUser(): DecodedToken | null {
    return this.decodedTokenSubject.value;
  }
}
