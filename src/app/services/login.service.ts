import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResponse {
  auth_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${import.meta.env['NG_APP_API_PREFIX']}/token/login`,
      { username, password }
    );
  }
}
