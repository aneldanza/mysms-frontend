import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

describe('authGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should allow access when user is logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    const result = executeGuard({} as any, { url: '/' } as any);

    expect(result).toBeTrue();
  });

  it('should redirect to /sign-in when user is not logged in', () => {
    const mockUrlTree = {} as any;
    mockAuthService.isLoggedIn.and.returnValue(false);
    mockRouter.createUrlTree.and.returnValue(mockUrlTree);

    const result = executeGuard({} as any, { url: '/' } as any);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/sign-in'], {
      queryParams: { redirect: '/' },
    });
    expect(result).toBe(mockUrlTree);
  });
});
