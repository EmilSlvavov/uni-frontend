import { computed, inject, Injectable, signal } from '@angular/core';
import { Course } from './course';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  readonly http = inject(HttpClient);
  readonly selectedDepartmentId = signal<number | null>(null);

  readonly coursesResource = httpResource<Course[]>(() => {
    const id = this.selectedDepartmentId();
    return id === null
      ? `${environment.apiUrl}/courses`
      : `${environment.apiUrl}/courses?departmentId=${id}`;
  });

  readonly courses = computed<Course[]>(() => {
    const resource = this.coursesResource;

    return resource.hasValue() ? resource.value() : [];
  });

  findById(id: number): Course | undefined {
    return this.courses().find((c) => c.id === id);
  }

  async enroll(userId: number, courseId: number): Promise<void> {
    await firstValueFrom(
      this.http.post<User>(`${environment.apiUrl}/users/${userId}/courses/${courseId}`, null),
    );
  }

  async createOnline(name: string, departmentId: number, meetingUrl: string): Promise<Course> {
    const created = await firstValueFrom(
      this.http.post<Course>(`${environment.apiUrl}/courses/online`, {
        name,
        departmentId,
        meetingUrl,
      }),
    );
    this.coursesResource.reload();
    return created;
  }

  async createOnsite(name: string, departmentId: number, roomNumber: number): Promise<Course> {
    const created = await firstValueFrom(
      this.http.post<Course>(`${environment.apiUrl}/courses/onsite`, {
        name,
        departmentId,
        roomNumber,
      }),
    );
    this.coursesResource.reload();
    return created;
  }

  async rename(courseId: number, name: string) {
    await firstValueFrom(
      this.http.put<Course>(`${environment.apiUrl}/courses/${courseId}`, { name }),
    );
    this.coursesResource.reload();
  }

  async softDelete(courseId: number) {
    await firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/courses/softDeleted/${courseId}`),
    );
    this.coursesResource.reload();
  }

  async restoreSoftDelete(courseId: number) {
    await firstValueFrom(
      this.http.patch<void>(`${environment.apiUrl}/courses/softDeleted/${courseId}`, null),
    );
    this.coursesResource.reload();
  }

  readonly onsiteRooms = computed(() =>
    this.courses()
      .filter((c) => c.type === 'ONSITE')
      .map((c) => c.roomNumber),
  );
}
