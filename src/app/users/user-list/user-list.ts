import { Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { User } from '../../auth/user';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {

  protected readonly userResource = httpResource<User[]>(() => {
    return `${environment.apiUrl}/users`;
  });

  protected reloadResources(): void {
    this.userResource.reload();
  }
}
