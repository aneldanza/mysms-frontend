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
  tooLong = false;

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
          this.resetBodyField();
        }
      });
  }

  resetBodyField() {
    this.form.get('body')?.reset();
    this.tooLong = false;
  }

  onInputLimit(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    if (input.value.length > 250) {
      this.tooLong = true;
      input.value = input.value.slice(0, 250);
      this.form.get('body')?.setValue(input.value);
    } else {
      this.tooLong = false;
    }
  }

  onPasteLimit(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    const currentValue = this.form.get('body')?.value || '';
    const total = currentValue.length + paste.length;

    if (total > 250) {
      event.preventDefault();
      this.tooLong = true;
      const allowedPaste = paste.slice(0, 250 - currentValue.length);
      this.form.get('body')?.setValue(currentValue + allowedPaste);
    } else {
      this.tooLong = false;
    }
  }
}
