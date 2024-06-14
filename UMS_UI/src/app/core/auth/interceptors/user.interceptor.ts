import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const userInterceptor: HttpInterceptorFn = (request, next) => {

  const authService = inject(AuthService)
  const token = authService.getToken();

  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    })
  }
  return next(request);
};