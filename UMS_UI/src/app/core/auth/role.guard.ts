import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonFunctionService } from '../../shared/commonFunction/common.function.service';

export const roleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const commonService = inject(CommonFunctionService)
  let subscription: Subscription;

  return new Promise<boolean>((resolve) => {
    subscription = authService.isLoggedIn.pipe(take(1)).subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          if (commonService.isAdminRole()) {
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
