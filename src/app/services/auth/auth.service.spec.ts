import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Subscription, of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    localStorage.clear();

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store token and decode user on successful login', () => {
    const dummyToken = 'dummy.jwt.token';
    const response = new Response(null, {
      headers: new Headers({ Authorization: `Bearer ${dummyToken}` }),
    });

    spyOn(service as any, 'setToken').and.callThrough();
    spyOn(service, 'getUserInfo').and.returnValue(of(null));
    service['handleLogin']({ headers: { get: () => `Bearer ${dummyToken}` } });

    expect((service as any).setToken).toHaveBeenCalledWith(dummyToken);
  });

  it('should clear token and state on logout', () => {
    localStorage.setItem(environment.tokenKey, 'fake_token');
    service['decodedTokenSubject'].next({
      jti: '123',
      exp: 9999999999,
      scp: 'user',
    });
    service['userSubject'].next({
      id: 1,
      username: 'test',
      email: '',
      created_at: '',
      updated_at: '',
    });

    service['handleLogout']();

    expect(localStorage.getItem(environment.tokenKey)).toBeNull();
    expect(service.getDecodedToken()).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign-in']);
  });

  it('should return false if no token or token expired', () => {
    expect(service.isLoggedIn()).toBeFalse();

    const expiredToken = {
      jti: 'jti',
      exp: Math.floor(Date.now() / 1000) - 60,
      scp: 'user',
    };
    (service as any).decodedTokenSubject.next(expiredToken);
    localStorage.setItem(environment.tokenKey, 'expired_token');

    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return true if token exists and not expired', () => {
    const validToken = {
      jti: 'jti',
      exp: Math.floor(Date.now() / 1000) + 60,
      scp: 'user',
    };
    (service as any).decodedTokenSubject.next(validToken);
    localStorage.setItem(environment.tokenKey, 'valid_token');

    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should sign in and store token', () => {
    const mockToken = 'Bearer mock.jwt.token';
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    service
      .signIn({ email: 'test@example.com', password: 'password' })
      .subscribe();

    const signInReq = httpMock.expectOne(
      `${environment.baseApi}/users/sign_in`
    );
    expect(signInReq.request.method).toBe('POST');

    signInReq.flush({}, { headers: { Authorization: mockToken } });

    const getUserReq = httpMock.expectOne(`${environment.baseApi}/me`);
    expect(getUserReq.request.method).toBe('GET');

    getUserReq.flush(mockUser); // <-- respond to getUserInfo call

    const storedToken = localStorage.getItem(environment.tokenKey);
    expect(storedToken).toBe('mock.jwt.token');
  });

  it('should log out and clear token', () => {
    localStorage.setItem(environment.tokenKey, 'test-token');

    service.logOut().subscribe(() => {
      expect(localStorage.getItem(environment.tokenKey)).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign-in']);
    });

    const req = httpMock.expectOne(`${environment.baseApi}/users/sign_out`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should fetch user info and update state', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    service.getUserInfo().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.baseApi}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
