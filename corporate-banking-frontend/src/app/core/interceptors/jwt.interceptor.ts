import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Don't add token to auth endpoints
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  if (token) {
    try {
      // Validate token format
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        
        // Check if token is expired
        const now = Date.now() / 1000;
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
          return next(req);
        }
      }

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Invalid token format:', error);
      localStorage.removeItem('token');
      router.navigate(['/login']);
    }
  }

  return next(req);
};
