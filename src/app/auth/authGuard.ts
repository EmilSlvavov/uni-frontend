import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) {
    return true
  }

  return inject(Router).createUrlTree(['/login'], { queryParams: {returnUrl: state.url}})

}
