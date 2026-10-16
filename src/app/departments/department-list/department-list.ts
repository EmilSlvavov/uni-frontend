import { Component, computed, inject, input, linkedSignal, numberAttribute } from '@angular/core';
import { DepartmentService } from '../department.service';
import { DepartmentCard } from '../department-card/department-card';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { Page } from '../../shared/page';
import { Department, DepartmentSearchForm } from '../department';
import { environment } from '../../../environments/environment';
import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [DepartmentCard, RouterLink, FormField],
  selector: 'app-department-list',
  styleUrl: './department-list.css',
  templateUrl: './department-list.html',
})
export class DepartmentList {
  protected readonly auth = inject(AuthService);
  protected readonly page = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });
  protected readonly q = input<string>();
  protected readonly router = inject(Router);
  protected readonly activeRoute = inject(ActivatedRoute);

  protected readonly resource = httpResource<Page<Department>>(() => ({
    url: `${environment.apiUrl}/departments`,
    params: {
      page: this.page(),
      size: 6,
      ...(this.q() ? { q: this.q()! } : {}),
    },
  }));

  protected readonly searchModel = linkedSignal<DepartmentSearchForm>(() => ({
    q: this.q() ?? '',
  }));

  protected reloadResources(): void {
    this.resource.reload();
  }

  protected readonly searchForm = form(this.searchModel);

  protected readonly pageNumbers = computed(() => {
    if (!this.resource.hasValue()) return [];
    const { number, totalPages } = this.resource.value().page;

    const window = 2;
    const pages = new Set<number>([0, totalPages - 1]);
    for (let p = number - window; p <= number + window; p++) {
      if (p >= 0 && p < totalPages) pages.add(p);
    }

    return [...pages].sort((a, b) => a - b);
  });

  protected search(q: string): void {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { q: q.trim() || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  protected goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { page: page || null },
      queryParamsHandling: 'merge',
    });
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
    this.search(this.searchForm().value().q);
  }
}
