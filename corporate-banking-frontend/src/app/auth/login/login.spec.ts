import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../authservice';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // ✅ CORRECT: Jasmine spy object
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'saveToken',
      'getRole'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(window, 'alert');

    await TestBed.configureTestingModule({
      imports: [LoginComponent], // standalone component
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to admin dashboard', () => {
    authService.login.and.returnValue(of({ token: 'fake-token' }));
    authService.getRole.and.returnValue('ROLE_ADMIN');

    component.username = 'admin';
    component.password = '123456';

    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('admin', '123456');
    expect(authService.saveToken).toHaveBeenCalledWith('fake-token');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/users']);
  });

  it('should login and navigate to analyst dashboard', () => {
    authService.login.and.returnValue(of({ token: 'fake-token' }));
    authService.getRole.and.returnValue('ROLE_ANALYST');

    component.username = 'analyst';
    component.password = '123456';

    component.onLogin();

    expect(router.navigate).toHaveBeenCalledWith(['/analyst/credits']);
  });

  it('should show error alert on login failure', () => {
    authService.login.and.returnValue(
      throwError(() => new Error('Invalid'))
    );

    component.onLogin();

    expect(window.alert).toHaveBeenCalledWith(
      'Invalid username or password'
    );
  });
});
