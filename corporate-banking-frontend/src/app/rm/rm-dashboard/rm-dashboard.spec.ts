import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RmDashboard } from './rm-dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('RmDashboard', () => {
  let component: RmDashboard;
  let fixture: ComponentFixture<RmDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmDashboard],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RmDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // 🔑 important
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
