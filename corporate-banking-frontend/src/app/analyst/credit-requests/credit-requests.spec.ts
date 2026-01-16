import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditRequestsComponent } from './credit-requests';
import { AnalystCreditService } from '../analyst-credit.service';
import { of, throwError } from 'rxjs';

describe('CreditRequestsComponent', () => {
  let component: CreditRequestsComponent;
  let fixture: ComponentFixture<CreditRequestsComponent>;

  let decideCalledWith: any[] | null = null;
  let throwErrorOnDecision = false;

  const mockCredits = [
    {
      id: '1',
      clientId: 'C001',
      requestAmount: 50000,
      tenureMonths: 12,
      purpose: 'Business',
      status: 'PENDING'
    },
    {
      id: '2',
      clientId: 'C002',
      requestAmount: 75000,
      tenureMonths: 24,
      purpose: 'Home',
      status: 'APPROVED'
    }
  ];

  const creditServiceMock = {
    getAllCredits: () => of(mockCredits),
    decideCredit: (id: string, status: string, remarks: string) => {
      decideCalledWith = [id, status, remarks];
      return throwErrorOnDecision
        ? throwError(() => new Error('Error'))
        : of({});
    }
  };

  beforeEach(async () => {
    decideCalledWith = null;
    throwErrorOnDecision = false;



    await TestBed.configureTestingModule({
      imports: [CreditRequestsComponent], // standalone
      providers: [
        { provide: AnalystCreditService, useValue: creditServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreditRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load credit requests on init', () => {
    expect(component.credits.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should open modal with selected credit and action', () => {
    component.openModal('1', 'APPROVED');

    expect(component.showModal).toBeTrue();
    expect(component.selectedCreditId).toBe('1');
    expect(component.selectedAction).toBe('APPROVED');
  });

  it('should not submit decision if remarks are empty', () => {
    component.selectedAction = 'APPROVED';
    component.remarks = '   ';

    component.submitDecision();

    expect(decideCalledWith).toBeNull();
  });

  it('should submit decision and reload credits on success', () => {
    component.openModal('1', 'APPROVED');
    component.remarks = 'Looks good';

    component.submitDecision();

    expect(decideCalledWith).toEqual([
      '1',
      'APPROVED',
      'Looks good'
    ]);
  });

  it('should handle decision error gracefully', () => {
    throwErrorOnDecision = true;

    component.openModal('1', 'REJECTED');
    component.remarks = 'Invalid docs';

    component.submitDecision();

    expect(component.decisionLoading).toBeFalse();
  });
});
