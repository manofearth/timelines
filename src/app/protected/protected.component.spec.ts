import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtectedComponent } from './protected.component';
import { RouterModule } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';

describe('ProtectedComponent', () => {
  let component: ProtectedComponent;
  let fixture: ComponentFixture<ProtectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProtectedComponent],
      imports: [
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
