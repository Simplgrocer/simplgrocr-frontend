import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private cookieService: CookieService) {}

  getAuthToken(): string {
    return this.cookieService.get('token');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();

    if (token) {
      return true;
    }

    return false;
  }

  postLoginProcessor(token: string): void {
    this.cookieService.set(
      'token',
      token,
      1,
      '/',
      `${import.meta.env['NG_APP_DOMAIN']}`,
      true,
      'None'
    );

    if (!this.isAuthenticated()) {
      throw new Error('Unable to login');
    }
  }

  logout() {
    this.cookieService.delete('token');
  }
}
