import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
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

interface MeasurementUnit {
  id: string;
  value: 'Unit' | 'Kilogram' | 'Gram';
}

@Component({
  selector: 'app-grocery-list-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContentEditableDirective],
  templateUrl: './grocery-list-create.component.html',
  styleUrl: './grocery-list-create.component.css',
})
export class GroceryListCreateComponent implements OnInit {
  measurementUnits: MeasurementUnit[] = [
    { id: '1', value: 'Unit' },
    { id: '2', value: 'Kilogram' },
    { id: '3', value: 'Gram' },
  ];

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
      items: new FormArray([]),
    });
  }

  getUserGroceryListItemsFormArrayControls(): AbstractControl<any, any>[] {
    return (this.groceryListForm.get('items') as FormArray).controls;
  }

  addUserGroceryListItem(): void {
    (this.groceryListForm.get('items') as FormArray).push(
      new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        rateMeasurementQuantity: new FormControl(0, [Validators.required]),
        rateMeasurementUnit: new FormControl('1', [Validators.required]),
        rate: new FormControl(0, [Validators.required]),
        quantityMeasurementUnit: new FormControl('1', [Validators.required]),
        quantity: new FormControl(0, [Validators.required]),
        price: new FormControl(0, [Validators.required]),
      })
    );
  }

  deleteUserGroceryListItem(index: number): void {
    (this.groceryListForm.get('items') as FormArray).removeAt(index);
  }

  updateItemPrice(index: number): void {
    const oldTotalPrice = this.groceryListForm.controls['totalPrice'].value;

    const oldPrice = (
      (this.groceryListForm.controls['items'] as FormArray).controls[
        index
      ] as FormGroup
    ).controls['price'].value;

    const newPrice = this.groceryListService.getItemPrice(
      (
        (this.groceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['rateMeasurementQuantity'].value,
      this.measurementUnits.find(
        (obj) =>
          obj.id ===
          (
            (this.groceryListForm.controls['items'] as FormArray).controls[
              index
            ] as FormGroup
          ).controls['rateMeasurementUnit'].value
      )!.value,
      (
        (this.groceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['rate'].value,
      this.measurementUnits.find(
        (obj) =>
          obj.id ===
          (
            (this.groceryListForm.controls['items'] as FormArray).controls[
              index
            ] as FormGroup
          ).controls['quantityMeasurementUnit'].value
      )!.value,
      (
        (this.groceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['quantity'].value
    );

    (
      (this.groceryListForm.controls['items'] as FormArray).controls[
        index
      ] as FormGroup
    ).controls['price'].setValue(newPrice);

    this.groceryListForm.controls['totalPrice'].setValue(
      oldTotalPrice + newPrice - oldPrice
    );
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
          if (
            (this.groceryListForm.controls['items'] as FormArray).length === 0
          ) {
            this.router.navigate(['/']);
          }

          const groceryListServiceId = response.id;

          const groceryListItemsArray = (
            this.groceryListForm.controls['items'] as FormArray
          ).value;

          for (let index = 0; index < groceryListItemsArray.length; index++) {
            const rateMeasurementUnit = this.measurementUnits.find(
              (obj) =>
                obj.id === groceryListItemsArray[index]['rateMeasurementUnit']
            )!.value;

            const quantityMeasurementUnit = this.measurementUnits.find(
              (obj) =>
                obj.id ===
                groceryListItemsArray[index]['quantityMeasurementUnit']
            )!.value;

            this.groceryListService
              .createUserGroceryListItem(groceryListServiceId, {
                name: groceryListItemsArray[index]['name'],
                description: groceryListItemsArray[index]['description']
                  ? groceryListItemsArray[index]['description']
                  : '',
                rate_measurement_quantity:
                  groceryListItemsArray[index]['rateMeasurementQuantity'],
                rate_measurement_unit: rateMeasurementUnit,
                rate: groceryListItemsArray[index]['rate'],
                quantity_measurement_unit: quantityMeasurementUnit,
                quantity: groceryListItemsArray[index]['quantity'],
                price: groceryListItemsArray[index]['price'],
                grocery_list: groceryListServiceId,
              })
              .subscribe({
                error: (err) => {
                  this.groceryListFormStatus = 'SubmissionError';
                  this.groceryListFormMessage =
                    'Apologies, there seems to be a technical issue. Our team is working on it. Please try again later. Thank you for your understanding.';
                },
              });
          }

          this.router.navigate(['/']);
        },
        error: (err) => {
          this.groceryListFormStatus = 'SubmissionError';
          this.groceryListFormMessage =
            'Apologies, there seems to be a technical issue. Our team is working on it. Please try again later. Thank you for your understanding.';
        },
      });
  }
}
