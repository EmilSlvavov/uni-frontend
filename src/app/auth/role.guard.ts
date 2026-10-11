import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { Me } from './user';

export type Role = Me['role'];

export function roleGuard(...roles: Role[]): CanActivateFn {
  return (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    return auth
      .whenUserResolved()
      .pipe(
        map((user) => (user && roles.includes(user.role) ? true : router.createUrlTree(['/']))),
      );
  };
}
