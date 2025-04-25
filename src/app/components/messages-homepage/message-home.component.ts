import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageFormComponent } from '../message-form/message-form.component';
import { MessageListComponent } from '../message-list/message-list.component';

@Component({
  selector: 'app-message-home',
  imports: [CommonModule, MessageFormComponent, MessageListComponent],
  standalone: true,
  templateUrl: './message-home.component.html',
  styleUrl: './message-home.component.css',
})
export class MessageHomeComponent {}
