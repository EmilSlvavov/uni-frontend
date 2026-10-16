import { inject, Injectable } from '@angular/core';
import { Course } from './course';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  readonly http = inject(HttpClient);

  async enroll(userId: number, courseId: number): Promise<void> {
    await firstValueFrom(
      this.http.post<User>(`${environment.apiUrl}/users/${userId}/courses/${courseId}`, null),
    );
  }

  async createOnline(name: string, departmentId: number, meetingUrl: string): Promise<Course> {
    return await firstValueFrom(
      this.http.post<Course>(`${environment.apiUrl}/courses/online`, {
        name,
        departmentId,
        meetingUrl,
      }),
    );
  }

  async createOnsite(name: string, departmentId: number, roomNumber: number): Promise<Course> {
    return await firstValueFrom(
      this.http.post<Course>(`${environment.apiUrl}/courses/onsite`, {
        name,
        departmentId,
        roomNumber,
      }),
    );
  }

  async rename(courseId: number, name: string) {
    await firstValueFrom(
      this.http.put<Course>(`${environment.apiUrl}/courses/${courseId}`, { name }),
    );
  }

  async softDelete(courseId: number) {
    await firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/courses/softDeleted/${courseId}`),
    );
  }

  async restoreSoftDelete(courseId: number) {
    await firstValueFrom(
      this.http.patch<void>(`${environment.apiUrl}/courses/softDeleted/${courseId}`, null),
    );
  }
}
