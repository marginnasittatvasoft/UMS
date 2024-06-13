import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let subscription: Subscription;

  return new Promise<boolean>((resolve) => {
    subscription = authService.isLoggedIn.pipe(take(1)).subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          const userRole = authService.getRole();
          if (userRole === 'Admin') {
            resolve(true);
          } else {
            router.navigate(['/Ums/home']).then(() => resolve(false));
          }
        } else {
          router.navigate(['/login']).then(() => resolve(false));
        }
      },
      error: (err) => {
        console.error('Error in role guard:', err);
        router.navigate(['/login']).then(() => resolve(false));
      }
    });
  }).finally(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
};
