import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  maxLength,
  minLength,
  required,
  FormField,
  submit,
} from '@angular/forms/signals';
import { RegisterModel } from '../user';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ProblemDetail } from '../../shared/problem-detail';

@Component({
  imports: [FormField],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  readonly model = signal<RegisterModel>({
    name: '',
    email: '',
    password: '',
  });

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly registerForm = form(this.model, (path) => {
    required(path.name, { message: 'name is required' });
    maxLength(path.name, 120, {
      message: 'name must be at most 120 characters',
    });

    required(path.email, { message: 'email is required' });
    email(path.email, { message: 'must be a valid email' });
    maxLength(path.email, 180, {
      message: 'email must be at most 180 characters',
    });

    required(path.password, { message: 'password is required' });
    minLength(path.password, 8, {
      message: 'password must be between 8 and 72 characters',
    });
    maxLength(path.password, 72, {
      message: 'password must be between 8 and 72 characters',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.registerForm, async (form) => {
      try {
        const { email, password } = form().value();

        await firstValueFrom(this.auth.register(form().value()));

        try {
          await this.auth.login(email, password);
          await this.router.navigate(['/courses']);
        } catch {
          await this.router.navigate(['/login']);
        }

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 409) {
          return [
            {
              kind: 'server',
              fieldTree: form.email,
              message: 'An account with this email already exists',
            },
          ];
        }

        if (err instanceof HttpErrorResponse && err.status === 400) {
          const problemDetail: ProblemDetail = err.error;

          return Object.entries(problemDetail.errors ?? {}).map(([field, message]) => {
            if (field === 'name') {
              return {
                kind: 'server',
                message,
                fieldTree: form.name,
              };
            }

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
