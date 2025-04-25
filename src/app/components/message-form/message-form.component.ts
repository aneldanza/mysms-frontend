import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MessagesService,
  Message,
} from '../../services/messages/messages.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './message-form.component.html',
})
export class MessageFormComponent {
  fb = inject(FormBuilder);
  messageService = inject(MessagesService);

  loading = false;
  error: string | null = null;
  success = false;

  form = this.fb.group({
    to: [
      '+18777804236',
      [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)],
    ],
    body: ['', [Validators.required, Validators.maxLength(250)]],
  });

  submit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    this.error = null;
    this.success = false;

    const data = this.form.value as Message;

    this.messageService
      .sendMessage(data)
      .pipe(
        catchError((err) => {
          this.error = 'Failed to send message. Please try again.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((res) => {
        if (res) {
          this.success = true;
          this.form.reset();
        }
      });
  }
}
