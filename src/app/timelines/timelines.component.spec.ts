import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelinesComponent } from './timelines.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

describe('TimelinesComponent', () => {
  let component: TimelinesComponent;
  let fixture: ComponentFixture<TimelinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelinesComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => Observable.of({}),
          },
        },
        { provide: Router, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
