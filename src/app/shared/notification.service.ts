import { Service, signal } from '@angular/core';

@Service()
export class NotificationService {
  private readonly messageSignal = signal<string | null>(null);
  readonly message = this.messageSignal.asReadonly();

  show(message: string): void {
    this.messageSignal.set(message);
  }

  dismiss(): void {
    this.messageSignal.set(null);
  }
}
