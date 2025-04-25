import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageFormComponent } from './message-form.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  MessagesService,
  MessageResponse,
} from '../../services/messages/messages.service';
import { of, throwError } from 'rxjs';

describe('MessageFormComponent', () => {
  let fixture: ComponentFixture<MessageFormComponent>;
  let component: MessageFormComponent;
  let messageService: MessagesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFormComponent],
      providers: [provideHttpClient(), MessagesService],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFormComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessagesService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form', () => {
    expect(component.form).toBeTruthy();
  });

  it('should trim pasted text to 250 characters if too long', () => {
    const event = {
      clipboardData: {
        getData: () => 'x'.repeat(300),
      },
      preventDefault: jasmine.createSpy(),
    } as any;

    component.form.controls['body'].setValue('');
    component.onPasteLimit(event);

    expect(component.form.value.body!.length).toBe(250);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should trim input to 250 characters on manual typing', () => {
    const event = {
      target: { value: 'x'.repeat(300) },
    } as any;

    component.onInputLimit(event);
    expect(component.form.value.body!.length).toBe(250);
    expect(component.tooLong).toBeTrue();
  });

  it('should emit message on successful submit', () => {
    const mockResponse: MessageResponse = {
      _id: { $oid: '1' },
      to: '+1234567890',
      body: 'Test message',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'delivered',
      twilio_sid: 'mock_twilio_sid',
    };

    spyOn(component.sendMessage, 'emit');
    spyOn(messageService, 'sendMessage').and.returnValue(of(mockResponse));

    component.form.controls['body'].setValue('Test message');
    component.submit();

    expect(component.sendMessage.emit).toHaveBeenCalledWith(mockResponse);
    expect(component.success).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should handle errors on failed submit', () => {
    spyOn(messageService, 'sendMessage').and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.form.controls['body'].setValue('Fail message');
    component.submit();

    expect(component.error).toBe('Failed to send message. Please try again.');
    expect(component.success).toBeFalse();
    expect(component.loading).toBeFalse();
  });
});
