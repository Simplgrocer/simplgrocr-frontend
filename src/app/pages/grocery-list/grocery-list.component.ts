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
import {
  GroceryListService,
  UserGroceryListItemResponse,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import { map } from 'rxjs';

interface MeasurementUnit {
  id: string;
  value: 'Unit' | 'Kilogram' | 'Gram';
}

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContentEditableDirective],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.css',
})
export class GroceryListComponent implements OnInit {
  measurementUnits: MeasurementUnit[] = [
    { id: '1', value: 'Unit' },
    { id: '2', value: 'Kilogram' },
    { id: '3', value: 'Gram' },
  ];

  id: string | null | undefined;

  groceryListForm!: FormGroup;

  groceryListFormStatus:
    | 'NotSubmitted'
    | 'Submitted'
    | 'SubmissionError'
    | 'InProgress' = 'NotSubmitted';

  groceryListFormMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private groceryListService: GroceryListService,
    private router: Router
  ) {}

  ngOnInit() {
    try {
      this.id = this.route.snapshot.url[1].path;
    } catch (error) {}

    if (this.id) {
      this.groceryListService.getUserGroceryList(this.id).subscribe({
        next: (response: UserGroceryListResponse) => {
          this.groceryListForm = new FormGroup({
            name: new FormControl(response.name, [Validators.required]),
            description: new FormControl(response.description),
            totalPrice: new FormControl(response.total_price),
            items: new FormArray([]),
          });

          this.groceryListService
            .getUserGroceryListItems(response.id)
            .pipe(
              map((response: UserGroceryListItemResponse[]) => {
                return response.map((item) => {
                  return new FormGroup({
                    name: new FormControl(item.name, [Validators.required]),
                    description: new FormControl(item.description),
                    rateMeasurementQuantity: new FormControl(
                      item.rate_measurement_quantity,
                      [Validators.required]
                    ),
                    rateMeasurementUnit: new FormControl(
                      this.measurementUnits.find(
                        (obj) => obj.value === item.rate_measurement_unit
                      )!.id,
                      [Validators.required]
                    ),
                    rate: new FormControl(item.rate, [Validators.required]),
                    quantityMeasurementUnit: new FormControl(
                      this.measurementUnits.find(
                        (obj) => obj.value === item.quantity_measurement_unit
                      )!.id,
                      [Validators.required]
                    ),
                    quantity: new FormControl(item.quantity, [
                      Validators.required,
                    ]),
                    pricerice: new FormControl(item.price, [
                      Validators.required,
                    ]),
                  });
                });
              })
            )
            .subscribe({
              next: (formGroups: FormGroup[]) => {
                if (this.groceryListForm) {
                  formGroups.forEach((formGroup) =>
                    (this.groceryListForm.get('items') as FormArray).push(
                      formGroup
                    )
                  );
                }
              },
              error: (err) => {
                this.groceryListFormStatus = 'SubmissionError';
                this.groceryListFormMessage =
                  'Apologies, there seems to be a technical issue. Our team is working on it. Please try again later. Thank you for your understanding.';
              },
            });
        },
        error: (err) => {
          this.groceryListFormStatus = 'SubmissionError';
          this.groceryListFormMessage =
            'Apologies, there seems to be a technical issue. Our team is working on it. Please try again later. Thank you for your understanding.';
        },
      });
    } else {
      this.groceryListForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        totalPrice: new FormControl(0),
        items: new FormArray([]),
      });
    }
  }

  getItemsArrayControls(): AbstractControl<any, any>[] {
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

  deleteItem(index: number): void {
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
    if (this.groceryListForm.valid) {
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

            const groceryListItemsFormArray = this.groceryListForm.controls[
              'items'
            ] as FormArray;

            const groceryListItems = (
              groceryListItemsFormArray.controls[0] as FormGroup
            ).controls['name'].value;

            for (let index = 0; index < groceryListItems.length; index++) {
              const groceryListItemsFormGroupControls = (
                groceryListItemsFormArray.controls[index] as FormGroup
              ).controls;

              this.groceryListService
                .createUserGroceryListItem(groceryListServiceId, {
                  name: groceryListItemsFormGroupControls['name'].value,
                  description: groceryListItemsFormGroupControls['description']
                    .value
                    ? groceryListItemsFormGroupControls['description'].value
                    : '',
                  rate_measurement_quantity:
                    groceryListItemsFormGroupControls['rateMeasurementQuantity']
                      .value,
                  rate_measurement_unit: this.measurementUnits.find(
                    (obj) =>
                      obj.id ===
                      groceryListItemsFormGroupControls['rateMeasurementUnit']
                        .value
                  )!.value,
                  rate: groceryListItemsFormGroupControls['rate'].value,
                  quantity_measurement_unit: this.measurementUnits.find(
                    (obj) =>
                      obj.id ===
                      groceryListItemsFormGroupControls[
                        'quantityMeasurementUnit'
                      ].value
                  )!.value,
                  quantity: groceryListItemsFormGroupControls['quantity'].value,
                  price: groceryListItemsFormGroupControls['price'].value,
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

  updateUserGroceryList() {
    console.log(1);
  }
}
