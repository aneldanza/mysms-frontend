import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { inject } from '@angular/core/testing';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signIn']);

    await TestBed.configureTestingModule({
      imports: [SignInComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should call authService.signIn on valid form submit', inject(
    [Router],
    (router: Router) => {
      const navigateSpy = spyOn(router, 'navigate');

      component.form.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      authServiceSpy.signIn.and.returnValue(of({}));

      component.onSubmit();

      expect(authServiceSpy.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(navigateSpy).toHaveBeenCalledWith(['']);
    }
  ));

  it('should not submit if form is invalid', inject(
    [Router],
    (router: Router) => {
      const navigateSpy = spyOn(router, 'navigate');

      component.form.setValue({
        email: '',
        password: '',
      });

      component.onSubmit();

      expect(authServiceSpy.signIn).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
    }
  ));

  it('should handle sign-in errors gracefully', () => {
    const consoleSpy = spyOn(console, 'error');
    component.form.setValue({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    authServiceSpy.signIn.and.returnValue(
      throwError(() => new Error('Unauthorized'))
    );

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalled();
  });
});
