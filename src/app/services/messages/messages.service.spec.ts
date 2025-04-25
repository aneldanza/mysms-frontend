import { TestBed } from '@angular/core/testing';
import { MessagesService, Message, MessageResponse } from './messages.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('MessagesService', () => {
  let service: MessagesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessagesService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(MessagesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a message and update messages$', () => {
    const mockMessage: Message = { to: '+1234567890', body: 'Hello' };
    const mockResponse: MessageResponse = {
      to: mockMessage.to,
      body: mockMessage.body,
      status: 'queued',
      twilio_sid: '12345',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      _id: { $oid: 'someid' },
    };

    service.sendMessage(mockMessage).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseApi}/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ message: mockMessage });

    req.flush(mockResponse);

    service.messages$.subscribe((messages) => {
      expect(messages.length).toBe(1);
      expect(messages[0]).toEqual(mockResponse);
    });
  });

  it('should get messages and update messages$', () => {
    const mockMessages: MessageResponse[] = [
      {
        to: '+1234567890',
        body: 'Hello there!',
        status: 'sent',
        twilio_sid: 'twilio123',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        _id: { $oid: 'someid' },
      },
    ];

    service.getMessages().subscribe((messages) => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne(`${environment.baseApi}/messages`);
    expect(req.request.method).toBe('GET');

    req.flush(mockMessages);

    service.messages$.subscribe((messages) => {
      expect(messages).toEqual(mockMessages);
    });
  });
});
