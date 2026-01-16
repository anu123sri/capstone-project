import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewCreditsComponent } from './view-credits';
import { RmCreditService } from '../rm-credit.service';
import { of } from 'rxjs';

describe('ViewCredits', () => {
  let component: ViewCreditsComponent;
  let fixture: ComponentFixture<ViewCreditsComponent>;
  let rmCreditService: jasmine.SpyObj<RmCreditService>;

  beforeEach(async () => {
    const rmCreditServiceSpy = jasmine.createSpyObj(
      'RmCreditService',
      ['getMyCreditRequests'] // ✅ MATCH COMPONENT METHOD
    );

    rmCreditServiceSpy.getMyCreditRequests.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ViewCreditsComponent],
      providers: [
        { provide: RmCreditService, useValue: rmCreditServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCreditsComponent);
    component = fixture.componentInstance;
    rmCreditService = TestBed.inject(
      RmCreditService
    ) as jasmine.SpyObj<RmCreditService>;

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(rmCreditService.getMyCreditRequests).toHaveBeenCalled();
  });
});
