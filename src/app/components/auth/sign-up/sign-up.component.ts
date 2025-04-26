import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
      username: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.auth.signUp(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          this.errorMessage =
            err.error?.message || 'Failed to sign up. Please try again.';
        },
      });
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get password_confirmation() {
    return this.form.get('password_confirmation');
  }

  get username() {
    return this.form.get('username');
  }
}
