import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageHomeComponent } from './message-home.component';
import { provideHttpClient } from '@angular/common/http';

describe('MessageHomeComponent', () => {
  let component: MessageHomeComponent;
  let fixture: ComponentFixture<MessageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageHomeComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
