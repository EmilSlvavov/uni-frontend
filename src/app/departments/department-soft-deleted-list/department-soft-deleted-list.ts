import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SoftDeletedDepartment } from '../department';
import { environment } from '../../../environments/environment';
import { DepartmentService } from '../department.service';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-department-soft-deleted-list',
  styleUrl: './department-soft-deleted-list.css',
  templateUrl: './department-soft-deleted-list.html',
})
export class DepartmentSoftDeletedList {
  private readonly departmentService = inject(DepartmentService);

  protected readonly softDeletedResource = httpResource<SoftDeletedDepartment[]>(() => {
    return `${environment.apiUrl}/departments/softDeleted?deleted=true`;
  });

  protected readonly restoreError = signal<string | null>(null);

  protected async onRestore(id: number): Promise<void> {
    this.restoreError.set(null);
    try {
      await this.departmentService.restoreSoftDelete(id);
      this.softDeletedResource.reload();
    } catch {
      this.restoreError.set('Could not restore this department. Please try again.');
    }
  }
}
