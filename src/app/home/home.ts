import { Component, computed, inject } from '@angular/core';
import { User } from '../auth/user';
import { httpResource } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { Course } from '../courses/course';
import { Department } from '../departments/department';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  protected readonly auth = inject(AuthService);
  protected readonly user = this.auth.currentUser;

  protected readonly studentResource = httpResource<User>(() => {
    return this.user()?.role === 'STUDENT'
      ? `${environment.apiUrl}/users/${this.user()!.id}`
      : undefined;
  });

  protected readonly professorResource = httpResource<Course[]>(() => {
    return this.user()?.role === 'PROFESSOR' ? `${environment.apiUrl}/courses` : undefined;
  });

  protected readonly professorCourses = computed(() => {
    return this.professorResource.value()?.filter((course) => course.lecturerId === this.user()?.id);
  });

  protected readonly adminUserResource = httpResource<User[]>(() => {
    return this.user()?.role === 'ADMIN' ? `${environment.apiUrl}/users` : undefined;
  });

  protected readonly adminUserCount = computed(() => {
    return this.adminUserResource.value()?.length;
  });

  protected readonly adminCourseResource = httpResource<Course[]>(() => {
    return this.user()?.role === 'ADMIN' ? `${environment.apiUrl}/courses` : undefined;
  });

  protected readonly adminCourseCount = computed(() => {
    return this.adminCourseResource.value()?.length;
  });

  protected readonly adminDepartmentResource = httpResource<Department[]>(() => {
    return this.user()?.role === 'ADMIN' ? `${environment.apiUrl}/departments` : undefined;
  });

  protected readonly adminDepartmentCount = computed(() => {
    return this.adminDepartmentResource.value()?.length;
  });
}
