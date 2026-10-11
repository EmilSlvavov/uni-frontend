import { Routes } from '@angular/router';
import { CourseList } from './courses/course-list/course-list';
import { CourseDetail } from './courses/course-detail/course-detail';
import { NotFound } from './shared/not-found/not-found';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth.guard';
import { DepartmentList } from './departments/department-list/department-list';
import { DepartmentDetail } from './departments/department-detail/department-detail';
import { roleGuard } from './auth/role.guard';
import { DepartmentCreate } from './departments/department-create/department-create';
import { DepartmentSoftDeletedList } from './departments/department-soft-deleted-list/department-soft-deleted-list';

export const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'my-courses',
    loadComponent: () => import('./my-courses/my-courses').then((m) => m.MyCourses),
    canActivate: [authGuard],
  },
  { path: 'departments', component: DepartmentList },
  { path: 'departments/new', component: DepartmentCreate, canActivate: [roleGuard('ADMIN')] },
  { path: 'departments/deleted', component: DepartmentSoftDeletedList, canActivate: [roleGuard('ADMIN')] },
  { path: 'departments/:id', component: DepartmentDetail },
  { path: 'courses', component: CourseList },
  { path: 'courses/:id', component: CourseDetail },
  { path: '**', component: NotFound },
];
