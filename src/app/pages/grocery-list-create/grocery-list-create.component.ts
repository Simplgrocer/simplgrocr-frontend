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

@Component({
  selector: 'app-grocery-list-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContentEditableDirective],
  templateUrl: './grocery-list-create.component.html',
  styleUrl: './grocery-list-create.component.css',
})
export class GroceryListCreateComponent implements OnInit {
  groceryListForm!: FormGroup;

  groceryListFormStatus:
    | 'NotSubmitted'
    | 'Submitted'
    | 'SubmissionError'
    | 'InProgress' = 'NotSubmitted';

  groceryListFormMessage!: string;

  constructor(
    private groceryListService: GroceryListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.groceryListForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      totalPrice: new FormControl(0),
    });
  }

  createUserGroceryList() {
    if (!this.groceryListForm.valid) {
    }

    this.groceryListFormStatus = 'InProgress';

    this.groceryListService
      .createUserGroceryList({
        name: this.groceryListForm.controls['name'].value,
        description: this.groceryListForm.controls['description'].value,
        total_price: this.groceryListForm.controls['totalPrice'].value,
      })
      .subscribe({
        next: (response: UserGroceryListResponse) => {
          this.groceryListFormStatus = 'InProgress';

          this.router.navigate([`/grocery-list/${response.id}`]);
        },
        error: (err) => {
          this.groceryListFormStatus = 'SubmissionError';
          this.groceryListFormMessage =
            'Apologies, there seems to be a technical issue. Our team is working on it. Please try again later. Thank you for your understanding.';
        },
      });
  }
}
