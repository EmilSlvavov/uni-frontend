import { Routes } from '@angular/router';
import { CourseList } from './courses/course-list/course-list';
import { CourseDetail } from './courses/course-detail/course-detail';
import { NotFound } from './shared/not-found/not-found';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { authGuard } from './auth/authGuard';

export const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'my-courses',
    loadComponent: () => import('./my-courses/my-courses').then((m) => m.MyCourses),
    canActivate: [authGuard],
  },
  { path: 'courses', component: CourseList },
  { path: 'courses/:id', component: CourseDetail },
  { path: '**', component: NotFound },
];
