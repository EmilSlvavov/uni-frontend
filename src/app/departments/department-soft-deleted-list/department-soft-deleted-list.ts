import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SoftDeletedDepartment } from '../department';
import { environment } from '../../../environments/environment';
import { DepartmentService } from '../department.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Page } from '../../shared/page';

@Component({
  imports: [RouterLink],
  selector: 'app-department-soft-deleted-list',
  styleUrl: './department-soft-deleted-list.css',
  templateUrl: './department-soft-deleted-list.html',
})
export class DepartmentSoftDeletedList {
  private readonly departmentService = inject(DepartmentService);

  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);

  protected readonly page = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });

  protected readonly softDeletedResource = httpResource<Page<SoftDeletedDepartment>>(() => ({
    url: `${environment.apiUrl}/departments/softDeleted`,
    params: { deleted: true, page: this.page(), size: 6 },
  }));

  protected readonly pageNumbers = computed(() => {
    if (!this.softDeletedResource.hasValue()) return [];
    const { number, totalPages } = this.softDeletedResource.value().page;

    const window = 2;
    const pages = new Set<number>([0, totalPages - 1]);
    for (let p = number - window; p <= number + window; p++) {
      if (p >= 0 && p < totalPages) pages.add(p);
    }

    return [...pages].sort((a, b) => a - b);
  });

  protected readonly restoreError = signal<string | null>(null);

  protected async onRestore(id: number): Promise<void> {
    this.restoreError.set(null);
    try {
      const lastOnPage = this.softDeletedResource.hasValue() && this.softDeletedResource.value().content.length === 1;
      await this.departmentService.restoreSoftDelete(id);
      if (lastOnPage && this.page() > 0) {
        this.goToPage(this.page() - 1);
      } else {
        this.softDeletedResource.reload();
      }
    } catch {
      this.restoreError.set('Could not restore this department. Please try again.');
    }
  }

  protected goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { page: page || null },
      queryParamsHandling: 'merge',
    });
  }
}
