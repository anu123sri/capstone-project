/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: any;

  beforeEach(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    localStorage.clear();
  });

  it('should allow access if token exists', () => {
    localStorage.setItem('token', 'abc');
    expect(guard.canActivate()).toBeTruthy();
  });

  it('should block access if token missing', () => {
    expect(guard.canActivate()).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
