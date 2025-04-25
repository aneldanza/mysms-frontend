import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesService } from '../../services/messages/messages.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  private messageService = inject(MessagesService);
  private auth = inject(AuthService);
  messages: any[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.messageService.getMessages().subscribe({
      error: (err) => {
        this.error = 'Failed to load messages';
        this.isLoading = false;
      },
    });

    this.messageService.messages$.subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
    });
  }
}
