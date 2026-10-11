import { Component, inject, signal } from '@angular/core';
import { DepartmentRequest } from '../department';
import { form, maxLength, required, submit, FormField } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { DepartmentService } from '../department.service';
import { Router } from '@angular/router';
import { ProblemDetail } from '../../shared/problem-detail';

@Component({
  imports: [FormField],
  selector: 'app-department-create',
  styleUrl: './department-create.css',
  templateUrl: './department-create.html',
})
export class DepartmentCreate {
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);

  readonly model = signal<DepartmentRequest>({
    name: '',
  });

  readonly createDepartmentForm = form(this.model, (path) => {
    required(path.name, { message: 'name is required' });
    maxLength(path.name, 100, {
      message: 'name must be at most 100 characters',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.createDepartmentForm, async (form) => {
      try {
        await this.departmentService.create(form().value().name);
        await this.router.navigate(['/departments']);

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
