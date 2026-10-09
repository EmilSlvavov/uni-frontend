import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // only our API, and never the auth endpoints themselves
  if (!req.url.startsWith(`${environment.apiUrl}`) || req.url.startsWith(`${environment.apiUrl}/auth/`)) {
    return next(req);
  }

  const withToken = (r: HttpRequest<unknown>, token: string | null) =>
    token ? r.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : r;

  return next(withToken(req, auth.accessToken())).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || !auth.accessToken()) {
        return throwError(() => err);
      }
      return from(auth.refreshAccessToken()).pipe(
        switchMap((token) => (token ? next(withToken(req, token)) : throwError(() => err))),
      );
    }),
  );
};
