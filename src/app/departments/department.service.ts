import { computed, inject, Service } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { ContactInfoRequest, Department } from './department';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Page } from '../shared/page';

@Service()
export class DepartmentService {

  private readonly http = inject(HttpClient);

  readonly departmentsResource = httpResource<Page<Department>>(() => {
    return `${environment.apiUrl}/departments?size=100&sort=name`;
  });

  readonly departments = computed<Department[]>(() => {
    const resource = this.departmentsResource;

    return resource.hasValue() ? resource.value().content : [];
  });

  async create(name: string): Promise<void> {
    await firstValueFrom(this.http.post<Department>(`${environment.apiUrl}/departments`, { name }));
    this.departmentsResource.reload();
  }

  async rename(departmentId: number, name: string): Promise<void> {
    await firstValueFrom(
      this.http.put<Department>(`${environment.apiUrl}/departments/${departmentId}`, { name }),
    );
    this.departmentsResource.reload();
  }

  async replaceContacts(departmentId: number, contacts: ContactInfoRequest) {
    await firstValueFrom(
      this.http.put<Department>(`${environment.apiUrl}/departments/${departmentId}/contacts`, contacts)
    )
    this.departmentsResource.reload();
  }

  async softDelete(departmentId: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/departments/softDeleted/${departmentId}`),
    );
    this.departmentsResource.reload();
  }

  async restoreSoftDelete(departmentId: number): Promise<void> {
    await firstValueFrom(
      this.http.patch<void>(
        `${environment.apiUrl}/departments/softDeleted/${departmentId}`,
        null,
      ),
    );
    this.departmentsResource.reload();
  }
}
