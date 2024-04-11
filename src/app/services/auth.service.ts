import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;

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
}
