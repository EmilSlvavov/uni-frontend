import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';
import { User, UserUpdateAbout, UserUpdateName, UserUpdatePassword } from '../../auth/user';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { ProblemDetail } from '../../shared/problem-detail';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-user-profile',
  styleUrl: './user-profile.css',
  templateUrl: './user-profile.html',
})
export class UserProfile {
  protected readonly id = input<string>();
  protected readonly auth = inject(AuthService);
  protected readonly userService = inject(UserService);
  protected readonly router = inject(Router);
  protected readonly notification = inject(NotificationService);

  protected readonly userId = computed(() => {
    if (this.id() !== undefined) {
      return Number(this.id());
    } else {
      return this.auth.currentUser()?.id;
    }
  });

  protected readonly isAccessingSelf = computed(() => {
    return this.userId() === this.auth.currentUser()?.id;
  });

  protected readonly userResource = httpResource<User>(() => {
    return this.userId() !== undefined ? `${environment.apiUrl}/users/${this.userId()}` : undefined;
  });

  readonly modelName = signal<UserUpdateName>({
    name: '',
  });

  readonly modelAbout = linkedSignal<UserUpdateAbout>(() => {
    const user = this.userResource.hasValue() ? this.userResource.value() : undefined;

    return {
      bio: user?.bio ?? '',
      dateOfBirth: user?.dateOfBirth ?? '',
    };
  });

  readonly modelPassword = signal<UserUpdatePassword>({
    currentPassword: '',
    newPassword: '',
  });

  readonly userNameUpdateForm = form(this.modelName, (path) => {
    required(path.name, { message: 'name is required' });
    maxLength(path.name, 120, { message: 'name must be at most 120 characters' });
  });

  readonly userUpdateAboutForm = form(this.modelAbout, (path) => {
    maxLength(path.bio, 2000, { message: 'bio must be at most 2000 characters' });
  });

  readonly userUpdatePasswordForm = form(this.modelPassword, (path) => {
    required(path.currentPassword, {
      message: 'current password is required',
      when: () => this.isAccessingSelf(),
    });
    required(path.newPassword, { message: 'new password is required' });
    minLength(path.newPassword, 8, { message: 'password must be between 8 and 72 characters' });
    maxLength(path.newPassword, 72, { message: 'password must be between 8 and 72 characters' });
  });

  async onSubmitName(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.userNameUpdateForm, async (form) => {
      try {
        await this.userService.updateName(this.userId()!, form().value().name);
        this.userResource.reload();
        if (this.isAccessingSelf()) {
          this.auth.reloadCurrentUser();
        }

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return [
            {
              kind: 'server',
              message: 'This user does not exist',
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

  async onSubmitAbout(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.userUpdateAboutForm, async (form) => {
      try {

        const dateOfBirth = new Date(form().value().dateOfBirth)
          .toISOString()
          .split('T')[0]

        await this.userService.updateProfile(
          this.userId()!,
          form().value().bio,
          dateOfBirth
        );
        this.userResource.reload();

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return [
            {
              kind: 'server',
              message: 'This user does not exist',
            },
          ];
        }

        if (err instanceof HttpErrorResponse && err.status === 400) {
          const problemDetail: ProblemDetail = err.error;

          return Object.entries(problemDetail.errors ?? {}).map(([field, message]) => {
            if (field === 'bio') {
              return {
                kind: 'server',
                message,
                fieldTree: form.bio,
              };
            }

            if (field === 'dateOfBirth') {
              return {
                kind: 'server',
                message,
                fieldTree: form.dateOfBirth,
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

  async onSubmitPassword(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.userUpdatePasswordForm, async (form) => {
      try {
        if (this.isAccessingSelf()) {
          await this.userService.changePassword(
            form().value().currentPassword,
            form().value().newPassword,
          );
          await this.auth.logout();
          this.notification.show('Password changed. Please log in again.');
          await this.router.navigate(['/login']);
        } else {
          await this.userService.resetPassword(this.userId()!, form().value().newPassword);
          form().reset({ currentPassword: '', newPassword: '' });
          this.notification.show('Password updated.');
        }

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return [
            {
              kind: 'server',
              message: 'This user does not exist',
            },
          ];
        }

        if (err instanceof HttpErrorResponse && err.status === 422) {
          if (this.isAccessingSelf()) {
            return [
              {
                kind: 'server',
                fieldTree: form.currentPassword,
                message: 'Current password is incorrect',
              },
            ];
          }
          return [{ kind: 'server', message: 'Use your own profile to change your own password' }];
        }

        if (err instanceof HttpErrorResponse && err.status === 400) {
          const problemDetail: ProblemDetail = err.error;

          return Object.entries(problemDetail.errors ?? {}).map(([field, message]) => {
            if (field === 'currentPassword') {
              return {
                kind: 'server',
                message,
                fieldTree: form.currentPassword,
              };
            }

            if (field === 'newPassword') {
              return {
                kind: 'server',
                message,
                fieldTree: form.newPassword,
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
