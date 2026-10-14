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
import { DepartmentEditName } from './departments/department-edit-name/department-edit-name';
import { DepartmentEditContacts } from './departments/department-edit-contacts/department-edit-contacts';
import { CourseCreate } from './courses/course-create/course-create';
import { CourseEdit } from './courses/course-edit/course-edit';
import { CourseSoftDeletedList } from './courses/course-soft-deleted-list/course-soft-deleted-list';
import { UserProfile } from './users/user-profile/user-profile';
import { UserList } from './users/user-list/user-list';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
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
  { path: 'departments/editName/:id', component: DepartmentEditName, canActivate: [roleGuard('ADMIN')]},
  { path: 'departments/editContacts/:id', component: DepartmentEditContacts, canActivate: [roleGuard('ADMIN')]},
  { path: 'departments/:id', component: DepartmentDetail },
  { path: 'courses', component: CourseList },
  { path: 'courses/new', component: CourseCreate, canActivate: [roleGuard('PROFESSOR', 'ADMIN')]},
  { path: 'courses/deleted', component: CourseSoftDeletedList, canActivate: [roleGuard('PROFESSOR', 'ADMIN')]},
  { path: 'courses/edit/:id', component: CourseEdit, canActivate: [roleGuard('PROFESSOR', 'ADMIN')]},
  { path: 'courses/:id', component: CourseDetail },
  { path: 'users/list', component: UserList, canActivate: [roleGuard('ADMIN')]},
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'profile/:id', component: UserProfile, canActivate: [roleGuard('ADMIN')] },
  { path: '**', component: NotFound },
];
