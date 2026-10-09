import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './shared/notification';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('uni-frontend');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly notifications = inject(NotificationService)

  protected async onLogout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/courses']);
  }
}
