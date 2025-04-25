import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageFormComponent } from './message-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // Use the recommended function
import { MessagesService } from '../../services/messages/messages.service';
import { provideHttpClient } from '@angular/common/http';

describe('MessageFormComponent', () => {
  let fixture: ComponentFixture<MessageFormComponent>;
  let component: MessageFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFormComponent], // ✅ Standalone component
      providers: [
        provideHttpClient(),
        MessagesService, // ✅ Provide the MessagesService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form', () => {
    expect(component.form).toBeTruthy();
  });

  it('should trim pasted text to 250 chars if too long', () => {
    const event = {
      clipboardData: {
        getData: () => 'x'.repeat(300), // Simulate 300 characters being pasted
      },
      preventDefault: jasmine.createSpy(),
    } as any;

    component.form.controls['body'].setValue(''); // Ensure the field is empty
    component.onPasteLimit(event); // Simulate the paste event

    expect(component.form.value.body!.length).toBe(250); // Ensure it is trimmed to 250
    expect(event.preventDefault).toHaveBeenCalled(); // Ensure default paste behavior is prevented
  });
});
