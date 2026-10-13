import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Course, CourseUpdateRequest } from '../course';
import { environment } from '../../../environments/environment';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { ProblemDetail } from '../../shared/problem-detail';
import { Router } from '@angular/router';
import { CourseService } from '../course.service';

@Component({
  imports: [FormField],
  selector: 'app-course-edit',
  styleUrl: './course-edit.css',
  templateUrl: './course-edit.html',
})
export class CourseEdit {
  readonly id = input.required({ transform: numberAttribute });
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

  readonly courseById = httpResource<Course>(() => {
    return `${environment.apiUrl}/courses/${this.id()}`;
  });

  readonly model = signal<CourseUpdateRequest>({
    name: '',
  });

  readonly renameCourseForm = form(this.model, (path) => {
    required(path.name, { message: 'name is required' });
    maxLength(path.name, 150, {
      message: 'name must be at most 150 characters',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.renameCourseForm, async (form) => {
      try {
        await this.courseService.rename(this.id(), form().value().name);
        await this.router.navigate(['/courses', this.id()]);

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 403) {
          return [
            {
              kind: 'server',
              message: 'You can only edit your own courses',
            },
          ];
        }

        if (err instanceof HttpErrorResponse && err.status === 404) {
          return [
            {
              kind: 'server',
              message: 'This course no longer exists',
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
