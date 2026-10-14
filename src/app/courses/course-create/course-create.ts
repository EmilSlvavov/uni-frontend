import { Component, inject, signal } from '@angular/core';
import { CourseService } from '../course.service';
import { Router } from '@angular/router';
import { CourseCreateRequest, CourseType } from '../course';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../../shared/problem-detail';
import { DepartmentService } from '../../departments/department.service';
import { CourseTypeLabelPipe } from '../../shared/course-type-label-pipe';

@Component({
  imports: [FormField, CourseTypeLabelPipe],
  selector: 'app-course-create',
  styleUrl: './course-create.css',
  templateUrl: './course-create.html',
})
export class CourseCreate {
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentService);
  protected readonly departments = this.departmentService.departments;
  protected readonly courseTypes: CourseType[] = ['ONLINE' , 'ONSITE'];

  readonly model = signal<CourseCreateRequest>({
    type: '',
    name: '',
    departmentId: '',
    roomNumber: '',
    meetingUrl: '',
  });

  readonly createCourseForm = form(this.model, (path) => {
    required(path.name, { message: 'name is required' });
    maxLength(path.name, 150, {
      message: 'name must be at most 150 characters',
    });

    required(path.departmentId, { message: 'department is required' });

    required(path.type, { message: 'type is required' });

    required(path.meetingUrl, {
      message: 'Meeting URL is required',
      when: ({ valueOf }) => valueOf(path.type) === 'ONLINE',
    });

    required(path.roomNumber, {
      message: 'Room number is required',
      when: ({ valueOf }) => valueOf(path.type) === 'ONSITE',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.createCourseForm, async (form) => {
      try {
        if (form().value().type === 'ONLINE') {
          const created = await this.courseService.createOnline(
            form().value().name,
            Number(form().value().departmentId),
            form().value().meetingUrl,
          );

          await this.router.navigate(['/courses', created.id]);
        }

        if (form().value().type === 'ONSITE') {
          const created = await this.courseService.createOnsite(
            form().value().name,
            Number(form().value().departmentId),
            Number(form().value().roomNumber),
          );

          await this.router.navigate(['/courses', created.id]);
        }

        return undefined;
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return [
            {
              kind: 'server',
              fieldTree: form.departmentId,
              message: 'A department with this id does not exist',
            },
          ];
        }

        if (err instanceof HttpErrorResponse && err.status === 422) {
          return [
            {
              kind: 'server',
              fieldTree: form.departmentId,
              message: 'This department is not available',
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

            if (field === 'departmentId') {
              return {
                kind: 'server',
                message,
                fieldTree: form.departmentId,
              };
            }

            if (field === 'meetingUrl') {
              return {
                kind: 'server',
                message,
                fieldTree: form.meetingUrl,
              };
            }

            if (field === 'roomNumber') {
              return {
                kind: 'server',
                message,
                fieldTree: form.roomNumber,
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
