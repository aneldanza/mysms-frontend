import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 12345,
    username: 'testuser',
    email: 'test@example.com',
    created_at: new Date().toString(),
    updated_at: new Date().toString(),
  };
  const decodedToken$ = new BehaviorSubject({ jti: '', exp: 0, scp: 'user' });
  const user$ = new BehaviorSubject(mockUser);

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj(
      'AuthService',
      ['logOut', 'getCurrentUser'],
      {
        decodedToken$: decodedToken$.asObservable(),
        user$: user$.asObservable(),
      }
    );

    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.logOut.and.returnValue(of({}));

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should return username from AuthService', () => {
    expect(component.username).toBe('testuser');
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
  });

  it('should call AuthService.logout and navigate to /sign-in on logout', () => {
    component.logOut();
    expect(authServiceSpy.logOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});
