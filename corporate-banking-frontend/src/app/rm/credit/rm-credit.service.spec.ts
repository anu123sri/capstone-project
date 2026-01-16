import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { RmCreditService } from './rm-credit.service';
import { environment } from '../../../environments/environment';

describe('RmCreditService', () => {
  let service: RmCreditService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/credit-requests`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RmCreditService]
    });

    service = TestBed.inject(RmCreditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a credit request', () => {
    const payload = {
      requestAmount: 50000,
      tenureMonths: 12,
      purpose: 'Working capital'
    };

    service.createCreditRequest(payload).subscribe(res => {
      expect(res).toEqual(payload);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(payload);
  });

  it('should fetch RM credit requests', () => {
    const mockCredits = [
      { id: '1', status: 'PENDING' },
      { id: '2', status: 'APPROVED' }
    ];

    service.getMyCreditRequests().subscribe(credits => {
      expect(credits.length).toBe(2);
      expect(credits).toEqual(mockCredits);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockCredits);
  });
});
