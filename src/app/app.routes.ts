import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/message-form/message-form.component').then(
        (m) => m.MessageFormComponent
      ),
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
];
