// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { provideHttpClient } from '@angular/common/http';
// import { SignUpComponent } from './sign-up.component';
// import { provideRouter } from '@angular/router';

// describe('SignUpComponent', () => {
//   let component: SignUpComponent;
//   let fixture: ComponentFixture<SignUpComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [SignUpComponent],
//       providers: [provideHttpClient(), provideRouter([])], // Provide router with empty routes
//     }).compileComponents();

//     fixture = TestBed.createComponent(SignUpComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signUp']);

    await TestBed.configureTestingModule({
      imports: [SignUpComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]), // ✅ Use Angular's testing router setup
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.form.setValue({
      email: '',
      password: '',
      password_confirmation: '',
      username: '',
    });

    component.onSubmit();

    expect(authServiceSpy.signUp).not.toHaveBeenCalled();
  });

  it('should call authService.signUp on valid form submission', () => {
    authServiceSpy.signUp.and.returnValue(of({}));

    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      username: 'tester',
    });

    component.onSubmit();

    expect(authServiceSpy.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      username: 'tester',
    });
  });

  it('should handle signup errors', () => {
    const consoleSpy = spyOn(console, 'error');
    authServiceSpy.signUp.and.returnValue(
      throwError(() => new Error('Signup failed'))
    );

    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      username: 'tester',
    });

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
