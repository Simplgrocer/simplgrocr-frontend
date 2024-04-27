import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import {
  GroceryListService,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CenteredProgressSpinnerComponent } from '../../components/centered-progress-spinner/centered-progress-spinner.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-grocery-list-create',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentEditableDirective,
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
  templateUrl: './grocery-list-create.component.html',
  styleUrl: './grocery-list-create.component.css',
})
export class GroceryListCreateComponent implements OnInit {
  userGroceryListForm!: FormGroup;
  disableUserGroceryListFormSubmission = true;
  disableInteraction = false;

  constructor(
    private groceryListService: GroceryListService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.userGroceryListForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      totalPrice: new FormControl(0),
    });

    this.userGroceryListForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.disableUserGroceryListFormSubmission = false;
      } else {
        this.disableUserGroceryListFormSubmission = true;
      }
    });
  }

  createUserGroceryList() {
    if (!this.userGroceryListForm.valid) {
    }

    this.disableInteraction = true;

    this.groceryListService
      .createUserGroceryList({
        name: this.userGroceryListForm.controls['name'].value,
        description: this.userGroceryListForm.controls['description'].value,
        total_price: this.userGroceryListForm.controls['totalPrice'].value,
      })
      .subscribe({
        next: (response: UserGroceryListResponse) => {
          this.disableInteraction = true;

          this.router.navigate([`/grocery-list/${response.id}`]);
        },
        error: (error) => {
          this.disableInteraction = false;

          this.messageService.add({
            key: 'tr',
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to create grocery list',
          });
        },
      });
  }
}
