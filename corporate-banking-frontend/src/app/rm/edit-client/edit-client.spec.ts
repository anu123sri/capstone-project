import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClientComponent } from './edit-client';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditClientComponent', () => {
  let component: EditClientComponent;
  let fixture: ComponentFixture<EditClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditClientComponent,
        HttpClientTestingModule // ✅ THIS STOPS REAL HTTP CALL
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // safe now
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
