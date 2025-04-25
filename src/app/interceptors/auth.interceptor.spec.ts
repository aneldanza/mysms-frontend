import { authInterceptor } from './auth.interceptor';
import { HttpRequest } from '@angular/common/http';
import { environment } from '../environments/environment';

describe('authInterceptor', () => {
  it('should add Authorization header when token is present', () => {
    const mockToken = 'fake-jwt-token';
    localStorage.setItem(environment.tokenKey, mockToken);

    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockNext = jasmine.createSpy('next');

    authInterceptor(mockRequest, mockNext);

    const interceptedRequest = mockNext.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
  });

  it('should not modify request if token is missing', () => {
    localStorage.removeItem(environment.tokenKey);

    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockNext = jasmine.createSpy('next');

    authInterceptor(mockRequest, mockNext);

    const interceptedRequest = mockNext.calls.mostRecent().args[0];
    expect(interceptedRequest.headers.has('Authorization')).toBeFalse();
  });
});
