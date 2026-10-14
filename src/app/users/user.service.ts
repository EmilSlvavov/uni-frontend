import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../auth/user';
import { environment } from '../../environments/environment';

@Service()
export class UserService {
  private readonly http = inject(HttpClient);

  async updateName(id: number, name: string): Promise<void> {
    await firstValueFrom(this.http.put<User>(`${environment.apiUrl}/users/${id}`, { name }));
  }

  async updateProfile(id: number, bio: string | null, dateOfBirth: string | null): Promise<void> {
    await firstValueFrom(
      this.http.put<User>(`${environment.apiUrl}/users/${id}/profile`, {
        bio: bio || null,
        dateOfBirth: dateOfBirth || null,
      }),
    );
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${environment.apiUrl}/users/password/me`, {
        currentPassword,
        newPassword,
      }),
    );
  }

  async resetPassword(id: number, newPassword: string): Promise<void> {
    await firstValueFrom(
      this.http.put<void>(`${environment.apiUrl}/users/password/${id}`, { newPassword }),
    );
  }
}
