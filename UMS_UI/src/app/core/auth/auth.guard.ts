import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let subscription: Subscription;

  return new Promise<boolean>((resolve) => {
    subscription = authService.isLoggedIn.pipe(take(1)).subscribe({
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
  }).finally(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
};
