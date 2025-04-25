// src/app/services/cable/cable.service.ts
import { Injectable } from '@angular/core';
import { createConsumer } from '@rails/actioncable';
import { BehaviorSubject } from 'rxjs';
import { MessageStatus } from '../messages/messages.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CableService {
  private consumer = createConsumer(`${environment.baseApi}/cable`); // use your deployed wss:// URL in prod
  private statusUpdates = new BehaviorSubject<{
    id: string;
    status: MessageStatus;
  } | null>(null);
  status$ = this.statusUpdates.asObservable();

  constructor() {
    this.subscribeToMessageStatus();
  }

  private subscribeToMessageStatus() {
    this.consumer.subscriptions.create(
      { channel: 'MessageStatusChannel' },
      {
        received: (data: { id: string; status: MessageStatus }) => {
          this.statusUpdates.next(data);
        },
      }
    );
  }
}
