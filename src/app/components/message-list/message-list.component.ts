import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MessagesService,
  MessageResponse,
} from '../../services/messages.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  imports: [CommonModule],
})
export class MessageListComponent implements OnInit {
  messages: MessageResponse[] = [];
  loading = true;
  error = '';

  constructor(private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.messagesService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load messages.';
        this.loading = false;
        console.error(err);
      },
    });
  }
}
