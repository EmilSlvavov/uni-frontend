import { Component, computed, inject, input, linkedSignal, numberAttribute } from '@angular/core';
import { CourseCard } from '../course-card/course-card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Course, CourseSearchForm, CourseType } from '../course';
import { httpResource } from '@angular/common/http';
import { Page } from '../../shared/page';
import { environment } from '../../../environments/environment';
import { form, FormField } from '@angular/forms/signals';

@Component({
  imports: [CourseCard, RouterLink, FormField],
  selector: 'app-course-list',
  styleUrl: './course-list.css',
  templateUrl: './course-list.html',
})
export class CourseList {
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  protected readonly activeRoute = inject(ActivatedRoute);

  protected readonly q = input<string>();
  protected readonly type = input<CourseType>();
  protected readonly page = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });

  protected readonly resource = httpResource<Page<Course>>(() => ({
    url: `${environment.apiUrl}/courses`,
    params: {
      page: this.page(),
      size: 6,
      ...(this.q() ? { q: this.q()! } : {}),
      ...(this.type() ? { type: this.type()! } : {}),
    },
  }));

  protected readonly searchModel = linkedSignal<CourseSearchForm>(() => ({
    q: this.q() ?? '',
    type: this.type() ?? '',
  }));

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

  protected reloadResources(): void {
    this.resource.reload();
  }

  protected search(q: string, type: CourseType | ''): void {
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { q: q.trim() || null, type: type || null, page: null },
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
    const { q, type } = this.searchForm().value();
    this.search(q, type);
  }
}
