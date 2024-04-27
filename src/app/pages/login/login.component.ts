import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CenteredProgressSpinnerComponent } from '../../components/centered-progress-spinner/centered-progress-spinner.component';
import { LoginResponse, LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';

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
    CommonModule,
    CenteredProgressSpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  disableLoginFormSubmission = true;
  disableInteraction = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.loginForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.disableLoginFormSubmission = false;
      } else {
        this.disableLoginFormSubmission = true;
      }
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
    }

    this.disableInteraction = true;

    this.loginService
      .login(this.loginForm.value.userName, this.loginForm.value.password)
      .subscribe({
        next: (response: LoginResponse) => {
          this.disableInteraction = false;

          try {
            this.authService.postLoginProcessor(response.auth_token);

            this.router.navigate(['/']).then(() => window.location.reload());
          } catch (error) {
            this.messageService.add({
              key: 'tr',
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to login',
            });
          }
        },
        error: (error: any) => {
          this.disableInteraction = false;

          this.messageService.add({
            key: 'tr',
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to login',
          });
        },
      });
  }
}
