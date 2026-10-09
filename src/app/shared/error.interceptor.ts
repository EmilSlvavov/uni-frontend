import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { NotificationService } from './notification';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && (err.status === 0 || err.status >= 500)) {
        notifications.show(
          err.status === 0 ? "Can't reach the server." : 'Something went wrong on the server.',
        );
      }
      return throwError(() => err);
    }),
  );
};
