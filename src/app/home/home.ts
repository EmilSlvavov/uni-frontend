import { Component, computed, inject } from '@angular/core';
import { User } from '../auth/user';
import { httpResource } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { Course } from '../courses/course';
import { Department } from '../departments/department';
import { RouterLink } from '@angular/router';
import { Page } from '../shared/page';

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

  protected readonly professorResource = httpResource<Page<Course>>(() => {
    return this.user()?.role === 'PROFESSOR' ? `${environment.apiUrl}/courses?lecturerId=${this.user()?.id}` : undefined;
  });

  protected readonly adminUserResource = httpResource<Page<User>>(() => {
    return this.user()?.role === 'ADMIN' ? `${environment.apiUrl}/users?size=1` : undefined;
  });

  protected readonly adminUserCount = computed(() => {
    return this.adminUserResource.value()?.page.totalElements;
  });

  protected readonly adminCourseResource = httpResource<Page<Course>>(() => {
    return this.user()?.role === 'ADMIN' ? `${environment.apiUrl}/courses?size=1` : undefined;
  });

  protected readonly adminCourseCount = computed(() => {
    return this.adminCourseResource.value()?.page.totalElements;
  });

  protected readonly adminDepartmentResource = httpResource<Page<Department>>(() => {
    return this.user()?.role === 'ADMIN' ? `${environment.apiUrl}/departments?size=1` : undefined;
  });

  protected readonly adminDepartmentCount = computed(() => {
    return this.adminDepartmentResource.value()?.page.totalElements;
  });
}
