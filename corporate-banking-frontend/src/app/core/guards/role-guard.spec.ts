/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { RoleGuard } from './role-guard';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let routerSpy: any;

  beforeEach(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    localStorage.clear();
  });

  function mockRoute(roles: string[]): ActivatedRouteSnapshot {
    return {
      data: { roles }
    } as unknown as ActivatedRouteSnapshot;
  }

  it('should allow valid role', () => {
    const token = `x.${btoa(JSON.stringify({ role: 'ROLE_ADMIN' }))}.y`;
    localStorage.setItem('token', token);

    expect(guard.canActivate(mockRoute(['ADMIN']))).toBeTruthy();
  });

  it('should deny invalid role', () => {
    const token = `x.${btoa(JSON.stringify({ role: 'ROLE_RM' }))}.y`;
    localStorage.setItem('token', token);

    expect(guard.canActivate(mockRoute(['ADMIN']))).toBeFalsy();
  });

  it('should redirect if token missing', () => {
    expect(guard.canActivate(mockRoute(['ADMIN']))).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
