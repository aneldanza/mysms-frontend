import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Message,
  MessagesService,
} from '../../services/messages/messages.service';
import { MessageListComponent } from '../message-list/message-list.component';

@Component({
  selector: 'app-message-form',
  imports: [FormsModule, CommonModule, MessageListComponent],
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.css',
})
export class MessageFormComponent {
  message: Message = {
    to: '+18777804236',
    body: '',
  };

  status: string = '';
  loading = false;

  constructor(private messagesService: MessagesService) {}

  sendMessage() {
    this.loading = true;
    this.status = '';

    this.messagesService.sendMessage(this.message).subscribe({
      next: (res) => {
        console.log(res);
        this.status = 'Message sent successfully!';
        this.message = { to: '', body: '' };
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.status = 'Failed to send message.';
        this.loading = false;
      },
    });
  }
}
