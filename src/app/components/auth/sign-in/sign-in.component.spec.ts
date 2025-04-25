import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SignInComponent } from './sign-in.component';
import { of } from 'rxjs';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]), // Provide router with empty routes
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
