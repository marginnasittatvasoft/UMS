import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return new Promise<boolean>((resolve) => {
    authService.isLoggedIn.pipe(take(1)).subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          const userRole = authService.getRole();
          if (userRole === 'Admin') {
            resolve(true);
          } else {
            router.navigate(['/Ums/user']).then(() => resolve(false));
          }
        } else {
          router.navigate(['/login']).then(() => resolve(false));
        }
      },
      error: () => {
        router.navigate(['/login']).then(() => resolve(false));
      }
    });
  });
};
