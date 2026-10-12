import { Component, inject, input, linkedSignal, numberAttribute } from '@angular/core';
import { DepartmentService } from '../department.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ContactInfoRequest, ContactType, Department } from '../department';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { applyEach, form, FormField, maxLength, required, submit } from '@angular/forms/signals';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-department-edit-contacts',
  styleUrl: './department-edit-contacts.css',
  templateUrl: './department-edit-contacts.html',
})
export class DepartmentEditContacts {
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  readonly id = input.required({ transform: numberAttribute });
  protected readonly contactTypes: ContactType[] = ['EMAIL', 'PHONE', 'OFFICE'];

  readonly departmentResource = httpResource<Department>(
    () => `${environment.apiUrl}/departments/${this.id()}`,
  );

  readonly model = linkedSignal<ContactInfoRequest>(() => ({
    contacts: this.departmentResource.hasValue() ? this.departmentResource.value().contacts : [],
  }));

  readonly contactsForm = form(this.model, (path) => {
    applyEach(path.contacts, (contact) => {
      required(contact.value, { message: 'value is required' });
      maxLength(contact.value, 200, { message: 'value must be at most 200 characters' });
    });
  });

  add(): void {
    this.model.update((m) => ({ contacts: [...m.contacts, { type: 'EMAIL', value: '' }] }));
  }

  remove(index: number): void {
    this.model.update((m) => ({ contacts: m.contacts.filter((_, i) => i !== index) }));
  }

  protected async onSave(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.contactsForm, async (form) => {
      try {
        await this.departmentService.replaceContacts(this.id(), form().value());
        await this.router.navigate(['/departments', this.id()]);
        return undefined;
      } catch (err) {
        const message =
          err instanceof HttpErrorResponse && err.status === 400
            ? 'Some contacts are invalid. Check the values and try again.'
            : err instanceof HttpErrorResponse && err.status === 0
              ? "Can't reach the server. Check your connection and try again."
              : 'Something went wrong. Please try again.';
        return [{ kind: 'server', message }];
      }
    });
  }
}
