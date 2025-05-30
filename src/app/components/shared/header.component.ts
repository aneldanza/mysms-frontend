import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  auth = inject(AuthService);
  router = inject(Router);

  decodedToken$ = this.auth.decodedToken$;
  user$ = this.auth.user$;

  logOut() {
    this.auth.logOut().subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }

  get username() {
    return this.auth.getCurrentUser()?.username || 'Guest';
  }
}
