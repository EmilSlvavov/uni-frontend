import { Component, computed, inject, input, linkedSignal, numberAttribute } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RoleName, User, UserSearchForm } from '../../auth/user';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Page } from '../../shared/page';
import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [RouterLink, FormField],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {
  protected readonly page = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });
  protected readonly q = input<string>();
  protected readonly role = input<RoleName>();
  protected readonly router = inject(Router);
  protected readonly activeRoute = inject(ActivatedRoute);

  protected readonly resource = httpResource<Page<User>>(() => ({
    url: `${environment.apiUrl}/users`,
    params: {
      page: this.page(),
      size: 6,
      ...(this.q() ? { q: this.q()! } : {}),
      ...(this.role() ? { role: this.role()! } : {})
    },
  }));

  protected readonly searchModel = linkedSignal<UserSearchForm>(() => ({
    q: this.q() ?? '',
    role: this.role() ?? '',
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

  protected search(q: string, role: RoleName | ''): void {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { q: q.trim() || null, role: role || null, page: null },
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
    const { q, role } = this.searchForm().value();
    this.search(q, role);
  }
}
