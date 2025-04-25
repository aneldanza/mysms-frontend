import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CableService } from '../cable/cable.service';

export type MessageStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'undelivered'
  | 'failed';

export interface Message {
  to: string;
  body: string;
}

export interface MessageResponse {
  body: string;
  created_at: string;
  status: MessageStatus;
  to: string;
  twilio_sid: string;
  updated_at: string;
  _id: {
    $oid: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private apiUrl = `${environment.baseApi}/messages`;
  private messagesSubject = new BehaviorSubject<MessageResponse[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private messageStatusSubject = new BehaviorSubject<MessageStatus>('queued');
  messageStatus$ = this.messageStatusSubject.asObservable();

  constructor(private http: HttpClient, private cable: CableService) {
    this.cable.status$.subscribe((data) => {
      if (!data) return;

      const updated = this.messagesSubject
        .getValue()
        .map((msg) =>
          msg._id.$oid === data.id ? { ...msg, status: data.status } : msg
        );
      this.messagesSubject.next(updated);
    });
  }

  sendMessage(message: Message): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.apiUrl, { message }).pipe(
      tap((newMsg) => {
        const currentMessages = this.messagesSubject.getValue();
        this.messagesSubject.next([newMsg, ...currentMessages]);
      })
    );
  }

  getMessages(): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(this.apiUrl).pipe(
      tap((messages) => {
        this.messagesSubject.next(messages);
      })
    );
  }
}
