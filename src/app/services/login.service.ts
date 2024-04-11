import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      'https://run.mocky.io/v3/b128776e-b2a6-4f21-becb-38893a75a4af',
      { username, password }
    );
  }
}
