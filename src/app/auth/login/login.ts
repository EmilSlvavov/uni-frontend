import { Component, inject, input, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { LoginModel } from '../user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../../shared/problem-detail';

@Component({
  imports: [FormField],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  readonly model = signal<LoginModel>({
    email: '',
    password: '',
  });
  readonly returnUrl = input<string>();

  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = form(this.model, (path) => {
    required(path.email, { message: 'email is required' });
    email(path.email, { message: 'must be a valid email' });

    required(path.password, { message: 'password is required' });
  });

  async onLogin(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.loginForm, async (form) => {
      try {

        const {email, password} = form().value()

        await this.auth.login(email, password);

        await this.router.navigateByUrl(this.returnUrl() ?? '/courses');

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return [
            {
              kind: 'server',
              message: 'Wrong password or email.',
            },
          ];
        }

        if (err instanceof HttpErrorResponse && err.status === 400) {
          const problemDetail: ProblemDetail = err.error;

          return Object.entries(problemDetail.errors ?? {}).map(([field, message]) => {

            if (field === 'email') {
              return {
                kind: 'server',
                message,
                fieldTree: form.email,
              };
            }

            if (field === 'password') {
              return {
                kind: 'server',
                message,
                fieldTree: form.password,
              };
            }

            return {
              kind: 'server',
              message,
            };
          });
        }

        const message =
          err instanceof HttpErrorResponse && err.status === 0
            ? "Can't reach the server. Check your connection and try again."
            : 'Something went wrong. Please try again.';

        return [{ kind: 'server', message }];
      }
    });
  }
}
