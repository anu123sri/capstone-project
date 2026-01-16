import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management';
import { AdminService } from './../adminservice';
import { of, throwError } from 'rxjs';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  let updateCalledWith: any[] | null = null;
  let createdUserPayload: any = null;

  const mockUsers = [
    {
      id: 1,
      username: 'rm_user',
      email: 'rm@test.com',
      role: 'RELATIONSHIP_MANAGER',
      active: true
    },
    {
      id: 2,
      username: 'analyst_user',
      email: 'analyst@test.com',
      role: 'ANALYST',
      active: false
    }
  ];

  const adminServiceMock = {
    getAllUsers: () => of(mockUsers),
    createUser: (payload: any) => {
      createdUserPayload = payload;
      return of({});
    },
    updateUserStatus: (id: number, active: boolean) => {
      updateCalledWith = [id, active];
      return of({});
    }
  };

  beforeEach(async () => {
    updateCalledWith = null;
    createdUserPayload = null;


    await TestBed.configureTestingModule({
      imports: [UserManagementComponent], // standalone
      providers: [
        { provide: AdminService, useValue: adminServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();

    expect(component.users.length).toBe(2);
  });

  it('should create a new user and reload users', () => {
    component.newUser = {
      username: 'admin',
      email: 'admin@test.com',
      password: '123456',
      role: 'ADMIN'
    };

    component.createUser();

    expect(createdUserPayload).toEqual({
      username: 'admin',
      email: 'admin@test.com',
      password: '123456',
      role: 'ADMIN'
    });

    expect(component.newUser).toEqual({
      username: '',
      email: '',
      password: '',
      role: ''
    });
  });

  it('should toggle user active status on success', () => {
    const user = { ...mockUsers[0] };

    component.toggleStatus(user);

    expect(updateCalledWith).toEqual([user.id, false]);
    expect(user.active).toBeFalse();
  });

  it('should not change status if update fails', () => {
    adminServiceMock.updateUserStatus = () =>
      throwError(() => new Error('Error'));

    const user = { ...mockUsers[0] };

    component.toggleStatus(user);

    expect(user.active).toBeTrue();
  });
});
