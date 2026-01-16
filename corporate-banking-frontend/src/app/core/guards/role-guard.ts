// import { AuthService } from './../../auth/authservice';
// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';


// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router
//   ) {}

//  canActivate(route: ActivatedRouteSnapshot): boolean {
//   const expectedRoles = route.data['roles']; // ['ROLE_ANALYST']
//   const token = localStorage.getItem('token');

//   if (!token) return false;

//   const payload = JSON.parse(atob(token.split('.')[1]));
//   const role = payload.role;

//   console.log('RoleGuard -> expected:', expectedRoles);
//   console.log('RoleGuard -> actual:', role);

//   return expectedRoles.includes(role);
// }

// }
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) {}

  private checkRole(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];

    if (!expectedRoles || expectedRoles.length === 0) {
      console.error('RoleGuard -> No roles defined for this route');
      this.router.navigate(['/unauthorized']);
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const normalizedRole = payload.role.replace('ROLE_', '');

    console.log('RoleGuard -> expected:', expectedRoles);
    console.log('RoleGuard -> actual:', normalizedRole);

    return expectedRoles.includes(normalizedRole);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkRole(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot): boolean {
    return this.checkRole(route);
  }
}
