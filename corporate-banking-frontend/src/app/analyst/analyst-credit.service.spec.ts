import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AnalystCreditService } from './analyst-credit.service';

describe('AnalystCreditService', () => {
  let service: AnalystCreditService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:9090/api/credit-requests';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalystCreditService]
    });

    service = TestBed.inject(AnalystCreditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensures no pending HTTP calls
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all credit requests', () => {
    const mockCredits = [
      { id: '1', status: 'PENDING' },
      { id: '2', status: 'APPROVED' }
    ];

    service.getAllCredits().subscribe(data => {
      expect(data).toEqual(mockCredits);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockCredits);
  });

  it('should approve or reject a credit request', () => {
  const requestId = '123';

  const payload = {
    status: 'APPROVED',
    remarks: 'Valid documents'
  } as const;

  service.decideCredit(
    requestId,
    payload.status,
    payload.remarks
  ).subscribe();

  const req = httpMock.expectOne(`${baseUrl}/${requestId}`);
  expect(req.request.method).toBe('PUT');
  expect(req.request.body).toEqual(payload);

  req.flush({});
});

});
