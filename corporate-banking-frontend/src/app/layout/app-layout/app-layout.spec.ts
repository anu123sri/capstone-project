import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLayoutComponent } from './app-layout';
import { AuthService } from '../../auth/authservice';
import { Router } from '@angular/router';

describe('AppLayoutComponent', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;

  let navigatedTo: any[] | null = null;
  let loggedOut = false;

  const authServiceMock = {
    getRole: () => 'ROLE_ADMIN',
    logout: () => {
      loggedOut = true;
    }
  };

  const routerMock = {
    navigate: (args: any[]) => {
      navigatedTo = args;
    }
  };

  beforeEach(async () => {
    navigatedTo = null;
    loggedOut = false;

    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent], // standalone component
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set role on init', () => {
    component.ngOnInit();

    expect(component.role).toBe('ROLE_ADMIN');
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(loggedOut).toBeTrue();
    expect(navigatedTo).toEqual(['/login']);
  });
});
