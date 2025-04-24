import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  _id?: string;
  to: string;
  body: string;
  status?: string;
  createdAt?: string;
}

export interface MessageResponse {
  body: string;
  created_at: string;
  status: string;
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
  private apiUrl = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {}

  sendMessage(message: Message): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.apiUrl, { message });
  }

  getMessages(): Observable<MessageResponse[]> {
    return this.http.get<MessageResponse[]>(this.apiUrl);
  }
}
