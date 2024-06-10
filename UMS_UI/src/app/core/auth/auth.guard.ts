import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    authService.isLoggedIn.pipe(take(1)).subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          resolve(true);
        } else {
          router.navigate(['/login']).then(() => resolve(false));
        }
      },
      error: (err) => {
        router.navigate(['/login']).then(() => resolve(false));
      }
    });
  });
};
