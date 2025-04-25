// src/app/services/cable/cable.service.ts
import { Injectable } from '@angular/core';
import cable from '@rails/actioncable';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CableService {
  private consumer = cable.createConsumer('ws://localhost:3000/cable'); // use your deployed wss:// URL in prod
  private statusUpdates = new BehaviorSubject<{
    id: string;
    status: string;
  } | null>(null);
  status$ = this.statusUpdates.asObservable();

  constructor() {
    this.subscribeToMessageStatus();
  }

  private subscribeToMessageStatus() {
    this.consumer.subscriptions.create(
      { channel: 'MessageStatusChannel' },
      {
        received: (data: { id: string; status: string }) => {
          this.statusUpdates.next(data);
        },
      }
    );
  }
}
