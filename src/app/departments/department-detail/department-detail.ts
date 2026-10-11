import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { DepartmentCard } from '../department-card/department-card';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Department } from '../department';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DepartmentService } from '../department.service';

@Component({
  imports: [DepartmentCard, RouterLink],
  selector: 'app-department-detail',
  styleUrl: './department-detail.css',
  templateUrl: './department-detail.html',
})
export class DepartmentDetail {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentService);
  readonly id = input.required({ transform: numberAttribute });

  protected readonly softDeleteError = signal<string | null>(null);

  readonly departmentById = httpResource<Department>(() => {
    return `${environment.apiUrl}/departments/${this.id()}`;
  });

  protected async onSoftDelete(): Promise<void> {
    try {
      await this.departmentService.softDelete(this.id());
      await this.router.navigate(['/departments']);
    } catch {
      this.softDeleteError.set('Could not soft delete this department. Please try again.');
    }
  }
}
