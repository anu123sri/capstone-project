import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './authservice';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API', () => {
    service.login('admin', '1234').subscribe(res => {
      expect(res.token).toBe('abc');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');

    req.flush({ token: 'abc' });
  });

  it('should save token', () => {
    service.saveToken('token123');
    expect(localStorage.getItem('token')).toBe('token123');
  });

  it('should get role from token', () => {
    const token = `x.${btoa(JSON.stringify({ role: 'ROLE_ADMIN' }))}.y`;
    localStorage.setItem('token', token);

    expect(service.getRole()).toBe('ROLE_ADMIN');
  });

  it('should clear storage on logout', () => {
    localStorage.setItem('token', 'x');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
