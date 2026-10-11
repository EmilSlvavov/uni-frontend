import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { LoginResponse, Me, RegisterModel, User } from './user';
import { filter, firstValueFrom, Observable, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'uni.session';
  private readonly session = signal<LoginResponse | null>(this.loadSession());
  private readonly router = inject(Router);

  private refreshInFlight: Promise<string | null> | null = null;

  register(body: RegisterModel): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, body);
  }

  private readonly meResource = httpResource<Me>(() =>
    this.session() ? `${environment.apiUrl}/users/me` : undefined,
  );

  readonly currentUser = computed(() =>
    this.meResource.hasValue() ? this.meResource.value() : null,
  );

  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  readonly isProfessor = computed(() => this.currentUser()?.role === 'PROFESSOR');

  reloadCurrentUser(): void {
    this.meResource.reload();
  }

  readonly isLoggedIn = computed(() => this.session() !== null);

  private readonly resolvedUser = computed<Me | null | undefined>(() => {
    if (!this.isLoggedIn()) return null;
    if (this.meResource.hasValue()) return this.meResource.value();
    if (this.meResource.error()) return null;
    return undefined;
  });

  whenUserResolved(): Observable<Me | null> {
    return this.resolvedUser$.pipe(
      filter((user): user is Me | null => user !== undefined),
      take(1),
    );
  }

  private readonly resolvedUser$ = toObservable(this.resolvedUser);

  async login(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password }),
    );
    this.setSession(response);
  }

  async logout(): Promise<void> {
    const refreshToken = this.session()?.refreshToken;
    this.setSession(null);
    if (refreshToken) {
      try {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }));
      } catch {}
    }
  }

  accessToken(): string | null {
    return this.session()?.token ?? null;
  }

  private setSession(s: LoginResponse | null): void {
    this.session.set(s);
    if (s) {
      localStorage.setItem(this.storageKey, JSON.stringify(s));
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  private loadSession(): LoginResponse | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : null;
  }

  refreshAccessToken(): Promise<string | null> {
    this.refreshInFlight ??= this.doRefresh().finally(() => {
      this.refreshInFlight = null;
    });
    return this.refreshInFlight;
  }

  private async doRefresh(): Promise<string | null> {
    const refreshToken = this.session()?.refreshToken;
    if (!refreshToken) {
      return null;
    }
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }),
      );
      this.setSession(response);
      return response.token;
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        this.setSession(null);
        void this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url },
        });
      }
      return null;
    }
  }
}
