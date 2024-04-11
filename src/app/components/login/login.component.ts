import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginResponse, LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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
  redirectionTimeout = 5000;
  redirectionTimeoutDisplay = 5;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginFormStatus = 'InProgress';

      this.loginService
        .login(this.loginForm.value.userName, this.loginForm.value.password)
        .subscribe({
          next: (response: LoginResponse) => {
            this.loginFormStatus = 'Submitted';

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
            this.loginFormStatus = 'SubmissionError';
          },
        });
    }
  }

  redirectUponLogin(): void {
    this.router.navigate(['/']);
  }
}
