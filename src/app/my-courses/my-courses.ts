import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { httpResource } from '@angular/common/http';
import { User } from '../auth/user';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  imports: [RouterLink],
  selector: 'app-my-courses',
  styleUrl: './my-courses.css',
  templateUrl: './my-courses.html',
})
export class MyCourses {
  private readonly auth = inject(AuthService);

  protected readonly me = httpResource<User>(() => {
    const user = this.auth.currentUser();
    return user ? `${environment.apiUrl}/users/${user.id}` : undefined;
  });
}
