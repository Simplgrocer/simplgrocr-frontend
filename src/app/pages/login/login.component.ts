import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginResponse, LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [MessageService],
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    ButtonModule,
    CardModule,
    DividerModule,
    ToastModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginFormStatus:
    | 'NotSubmitted'
    | 'Submitted'
    | 'SubmissionError'
    | 'InProgress' = 'NotSubmitted';
  loginFormSubmissionButtonLoadingState = false;
  redirectionTimeout = 5000;
  redirectionTimeoutDisplay = 5;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
    }

    this.loginFormSubmissionButtonLoadingState = true;
    this.loginFormStatus = 'InProgress';

    this.loginService
      .login(this.loginForm.value.userName, this.loginForm.value.password)
      .subscribe({
        next: (response: LoginResponse) => {
          this.loginFormSubmissionButtonLoadingState = false;

          this.cookieService.set(
            'token',
            response.auth_token,
            1,
            '/',
            `${import.meta.env['NG_APP_DOMAIN']}`,
            true,
            'None'
          );

          let startTime = Date.now();

          const interval = setInterval(() => {
            let currentTime = Date.now();
            let elapsedTime = currentTime - startTime;

            if (elapsedTime < 5000) {
              this.redirectionTimeoutDisplay--;
            } else {
              this.redirectUponLogin();

              clearInterval(interval);
            }
          }, 1000);
        },
        error: (err: any) => {
          this.loginFormSubmissionButtonLoadingState = false;

          this.messageService.add({
            key: 'tr',
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to login',
          });
        },
      });
  }

  redirectUponLogin(): void {
    this.router.navigate(['/']);
  }
}
