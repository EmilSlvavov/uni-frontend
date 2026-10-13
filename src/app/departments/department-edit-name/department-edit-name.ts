import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { DepartmentService } from '../department.service';
import { Router } from '@angular/router';
import { DepartmentRequest } from '../department';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../../shared/problem-detail';

@Component({
  imports: [FormField],
  selector: 'app-department-edit-name',
  styleUrl: './department-edit-name.css',
  templateUrl: './department-edit-name.html',
})
export class DepartmentEditName {
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  readonly id = input.required({ transform: numberAttribute });

  readonly model = signal<DepartmentRequest>({
    name: '',
  });

  readonly renameDepartmentForm = form(this.model, (path) => {
    required(path.name, { message: 'name is required' });
    maxLength(path.name, 100, {
      message: 'name must be at most 100 characters',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.renameDepartmentForm, async (form) => {
      try {
        await this.departmentService.rename(this.id(), form().value().name);
        await this.router.navigate(['/departments', this.id()]);

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 409) {
          return [
            {
              kind: 'server',
              fieldTree: form.name,
              message: 'A department with this name already exists',
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
}
