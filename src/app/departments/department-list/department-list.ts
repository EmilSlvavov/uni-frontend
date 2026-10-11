import { Component, inject } from '@angular/core';
import { DepartmentService } from '../department.service';
import { DepartmentCard } from '../department-card/department-card';
import { AuthService } from '../../auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DepartmentCard, RouterLink],
  selector: 'app-department-list',
  styleUrl: './department-list.css',
  templateUrl: './department-list.html',
})
export class DepartmentList {
  protected readonly auth = inject(AuthService);
  private readonly departmentService = inject(DepartmentService);
  protected readonly resource = this.departmentService.departmentsResource;

  protected reloadResources(): void {
    this.resource.reload();
  }
}
