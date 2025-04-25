import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, BehaviorSubject, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  jti: string;
  exp: number;
  scp: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.baseApi;
  private tokenKey = environment.tokenKey;
  private decodedTokenSubject = new BehaviorSubject<DecodedToken | null>(null);
  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable();
  decodedToken$ = this.decodedTokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.setInfoFromToken(token);
      this.getUserInfo().subscribe();
    }
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

  getUserInfo() {
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user: User) => {
        this.userSubject.next(user);
      }),
      catchError((err) => {
        console.warn('Failed to fetch user info', err);
        this.handleLogout();
        return of(null);
      })
    );
  }

  getCurrentUser() {
    return this.userSubject.value;
  }

  signUp(data: any) {
    return this.http
      .post(`${this.apiUrl}/users`, { user: data }, { observe: 'response' })
      .pipe(
        tap((response: any) => {
          this.handleLogin(response);
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
          this.handleLogin(response);
        })
      );
  }

  logOut() {
    return this.http.delete(`${this.apiUrl}/users/sign_out`).pipe(
      tap(() => {
        this.handleLogout();
      })
    );
  }

  handleLogin(res: any) {
    const token = res.headers?.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      this.setToken(token);
      this.getUserInfo().subscribe();
    } else {
      console.warn('No JWT token found in Authorization header');
    }
  }

  handleLogout() {
    localStorage.removeItem(this.tokenKey);
    this.decodedTokenSubject.next(null);
    this.userSubject.next(null);
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
    const token = this.getToken();
    return !!token && !this.tokenExpired();
  }

  tokenExpired() {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken?.exp) return true;
    return new Date(decodedToken.exp * 1000) <= new Date();
  }

  getDecodedToken(): DecodedToken | null {
    return this.decodedTokenSubject.value;
  }
}
