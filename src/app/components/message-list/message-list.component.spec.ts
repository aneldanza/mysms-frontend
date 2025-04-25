import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageListComponent } from './message-list.component';
import { MessagesService } from '../../services/messages/messages.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;
  let mockMessages$: Subject<any[]>;

  const mockMessages = [
    {
      _id: '1',
      to: '+1234567890',
      body: 'Test 1',
      created_at: new Date().toISOString(),
    },
    {
      _id: '2',
      to: '+1234567890',
      body: 'Test 2',
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(async () => {
    mockMessages$ = new Subject<any[]>();

    await TestBed.configureTestingModule({
      imports: [MessageListComponent],
      providers: [
        provideHttpClient(),
        {
          provide: MessagesService,
          useValue: {
            getMessages: jasmine.createSpy().and.returnValue(of(undefined)),
            messages$: mockMessages$.asObservable(),
          },
        },
        {
          provide: AuthService,
          useValue: {}, // Can be expanded later if needed
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set messages from messages$ stream', () => {
    mockMessages$.next(mockMessages);
    fixture.detectChanges();

    expect(component.messages.length).toBe(2);
    expect(component.isLoading).toBeFalse();
  });

  it('should show error if getMessages fails', () => {
    const msgService = TestBed.inject(MessagesService);
    (msgService.getMessages as jasmine.Spy).and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.ngOnInit();

    expect(component.error).toBe('Failed to load messages');
    expect(component.isLoading).toBeFalse();
  });
});
