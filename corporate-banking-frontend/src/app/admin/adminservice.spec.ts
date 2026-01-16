import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './adminservice';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', () => {
    const mockUsers = [
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ];

    service.getAllUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(
      'http://localhost:9090/api/admin/users'
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  it('should create a new user', () => {
    const newUser = { name: 'John', role: 'ADMIN' };

    service.createUser(newUser).subscribe(response => {
      expect(response).toEqual(newUser);
    });

    const req = httpMock.expectOne(
      'http://localhost:9090/api/admin/users'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);

    req.flush(newUser);
  });

  it('should update user status', () => {
    const userId = '123';
    const active = true;

    service.updateUserStatus(userId, active).subscribe();

    const req = httpMock.expectOne(
      `http://localhost:9090/api/admin/users/${userId}/status?active=${active}`
    );
    expect(req.request.method).toBe('PUT');

    req.flush({});
  });
});
