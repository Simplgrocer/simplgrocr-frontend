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
  GroceryListItemCreationUpdationPayload,
  GroceryListService,
  GroceryListUpdationPayload,
  UserGroceryListItemResponse,
  UserGroceryListResponse,
  UserGroceryListSummaryExportResponse,
} from '../../services/grocery-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import { map } from 'rxjs';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { CenteredProgressSpinnerComponent } from '../../components/centered-progress-spinner/centered-progress-spinner.component';
import { MessageService, PrimeNGConfig } from 'primeng/api';

interface MeasurementUnit {
  id: string;
  value: 'Unit' | 'Kilogram' | 'Gram';
}

interface UserGroceryListFormItemsFormGroupChangeActions {
  added: FormGroup[];
  deleted: FormGroup[];
  modified: FormGroup[];
}

@Component({
  selector: 'app-grocery-list-view-update',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContentEditableDirective,
    MenubarModule,
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
  templateUrl: './grocery-list-view-update.component.html',
  styleUrl: './grocery-list-view-update.component.css',
})
export class GroceryListViewUpdateComponent implements OnInit {
  disableUserGroceryListBasicFormUpdation = true;
  disableInteraction = false;

  initialUserGroceryListFormValues: {
    name: string;
    description: string;
    totalPrice: number;
  } = {
    name: '',
    description: '',
    totalPrice: 0,
  };

  measurementUnits: MeasurementUnit[] = [
    { id: '1', value: 'Unit' },
    { id: '2', value: 'Kilogram' },
    { id: '3', value: 'Gram' },
  ];

  id = '';

  userGroceryListForm!: FormGroup;

  groceryListFormStatus:
    | 'NotSubmitted'
    | 'Submitted'
    | 'SubmissionError'
    | 'InProgress' = 'NotSubmitted';

  groceryListFormMessage!: string;

  userGroceryListSummaryExportStatus: 'NotExported' | 'Exported' =
    'NotExported';

  constructor(
    private route: ActivatedRoute,
    private groceryListService: GroceryListService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.url[1].path;

    this.primengConfig.ripple = true;

    this.groceryListService.getUserGroceryList(this.id).subscribe({
      next: (response: UserGroceryListResponse) => {
        this.userGroceryListForm = new FormGroup({
          name: new FormControl(response.name, [Validators.required]),
          description: new FormControl(response.description),
          totalPrice: new FormControl(response.total_price),
          items: new FormArray([]),
        });

        this.initialUserGroceryListFormValues.name = response.name;
        this.initialUserGroceryListFormValues.description =
          response.description;

        this.userGroceryListForm.valueChanges.subscribe(() => {
          const nameControl = this.userGroceryListForm.get('name')!;
          const descriptionControl =
            this.userGroceryListForm.get('description')!;

          const nameIsValid = nameControl.valid;
          const descriptionIsValid = descriptionControl.valid;

          if (nameIsValid && descriptionIsValid) {
            const nameChanged =
              nameControl.value !== this.initialUserGroceryListFormValues.name;
            const descriptionChanged =
              descriptionControl.value !==
              this.initialUserGroceryListFormValues.description;

            if (nameChanged || descriptionChanged) {
              this.disableUserGroceryListBasicFormUpdation = false;
            } else {
              this.disableUserGroceryListBasicFormUpdation = true;
            }
          } else {
            this.disableUserGroceryListBasicFormUpdation = true;
          }
        });

        this.groceryListService
          .getUserGroceryListItems(response.id)
          .pipe(
            map((response: UserGroceryListItemResponse[]) => {
              return response.map((item) => {
                return new FormGroup({
                  id: new FormControl(item.id),
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
                  price: new FormControl(item.price, [Validators.required]),
                  update: new FormControl(false),
                });
              });
            })
          )
          .subscribe({
            next: (formGroups: FormGroup[]) => {
              if (this.userGroceryListForm) {
                formGroups.forEach((formGroup) =>
                  (this.userGroceryListForm.get('items') as FormArray).push(
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
  }

  getItemsArrayControls(): AbstractControl<any, any>[] {
    return (this.userGroceryListForm.get('items') as FormArray).controls;
  }

  addUserGroceryListItem(): void {
    this.groceryListService
      .createUserGroceryListItem(this.id, {
        name: '',
        description: '',
        rate_measurement_quantity: 0,
        rate_measurement_unit: 'Unit',
        rate: 0,
        quantity_measurement_unit: 'Unit',
        quantity: 0,
        price: 0,
        grocery_list: this.id as unknown as number,
      })
      .subscribe({
        next: (response: UserGroceryListItemResponse) => {
          (this.userGroceryListForm.get('items') as FormArray).push(
            new FormGroup({
              id: new FormControl(response.id),
              name: new FormControl('', [Validators.required]),
              description: new FormControl(''),
              rateMeasurementQuantity: new FormControl(0, [
                Validators.required,
              ]),
              rateMeasurementUnit: new FormControl('1', [Validators.required]),
              rate: new FormControl(0, [Validators.required]),
              quantityMeasurementUnit: new FormControl('1', [
                Validators.required,
              ]),
              quantity: new FormControl(0, [Validators.required]),
              price: new FormControl(0, [Validators.required]),
              update: new FormControl(false),
            })
          );
        },
      });
  }

  updateUserGroceryListItem(index: number): void {
    // this.groceryListFormStatus = 'InProgress';

    const userGroceryListItemsFormArray = this.userGroceryListForm.get(
      'items'
    ) as FormArray;

    const userGroceryListItemPayload = (
      userGroceryListItemsFormArray.controls[index] as FormGroup
    ).value;

    this.groceryListService
      .updatePutUserGroceryListItem(this.id, userGroceryListItemPayload.id, {
        name: userGroceryListItemPayload.name,
        description: userGroceryListItemPayload.description,
        rate_measurement_quantity:
          userGroceryListItemPayload.rateMeasurementQuantity,
        rate_measurement_unit: this.measurementUnits.find(
          (obj) => obj.id === userGroceryListItemPayload.rateMeasurementUnit
        )!.value,
        rate: userGroceryListItemPayload.rate,
        quantity_measurement_unit: this.measurementUnits.find(
          (obj) => obj.id === userGroceryListItemPayload.quantityMeasurementUnit
        )!.value,
        quantity: userGroceryListItemPayload.quantity,
        price: userGroceryListItemPayload.price,
        grocery_list: this.id as unknown as number,
      })
      .subscribe({
        next: () => {
          const price = (
            userGroceryListItemsFormArray.controls[index] as FormGroup
          ).controls['price'].value;

          this.groceryListService
            .updatePatchUserGroceryList(this.id, {
              total_price:
                this.userGroceryListForm.controls['totalPrice'].value,
            })
            .subscribe({});

          // this.groceryListFormStatus = 'Submitted';
        },
        error: () => {
          // this.groceryListFormStatus = 'SubmissionError';
        },
      });
  }

  deleteUserGroceryListItem(index: number): void {
    const userGroceryListItemsFormArray = this.userGroceryListForm.get(
      'items'
    ) as FormArray;

    const id = (userGroceryListItemsFormArray.controls[index] as FormGroup)
      .controls['id'].value;

    const oldPrice = (
      userGroceryListItemsFormArray.controls[index] as FormGroup
    ).controls['price'].value;

    this.groceryListService.deleteUserGroceryListItem(this.id, id).subscribe({
      next: () => {
        this.groceryListService
          .updatePatchUserGroceryList(this.id, {
            total_price: this.userGroceryListForm.controls['totalPrice'].value,
          })
          .subscribe({
            next: () => {
              (this.userGroceryListForm.get('items') as FormArray).removeAt(
                index
              );

              this.userGroceryListForm.controls['totalPrice'].setValue(
                this.userGroceryListForm.controls['totalPrice'].value - oldPrice
              );
            },
          });
      },
    });
  }

  updateItemPrice(index: number): void {
    console.log(
      (
        (this.userGroceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['update'].value
    );

    if (
      !(
        (this.userGroceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['update'].value
    ) {
      (
        (this.userGroceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['update'].setValue(true);
    }

    const oldTotalPrice = this.userGroceryListForm.controls['totalPrice'].value;

    const oldPrice = (
      (this.userGroceryListForm.controls['items'] as FormArray).controls[
        index
      ] as FormGroup
    ).controls['price'].value;

    const newPrice = this.groceryListService.getItemPrice(
      (
        (this.userGroceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['rateMeasurementQuantity'].value,
      this.measurementUnits.find(
        (obj) =>
          obj.id ===
          (
            (this.userGroceryListForm.controls['items'] as FormArray).controls[
              index
            ] as FormGroup
          ).controls['rateMeasurementUnit'].value
      )!.value,
      (
        (this.userGroceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['rate'].value,
      this.measurementUnits.find(
        (obj) =>
          obj.id ===
          (
            (this.userGroceryListForm.controls['items'] as FormArray).controls[
              index
            ] as FormGroup
          ).controls['quantityMeasurementUnit'].value
      )!.value,
      (
        (this.userGroceryListForm.controls['items'] as FormArray).controls[
          index
        ] as FormGroup
      ).controls['quantity'].value
    );

    (
      (this.userGroceryListForm.controls['items'] as FormArray).controls[
        index
      ] as FormGroup
    ).controls['price'].setValue(newPrice);

    this.userGroceryListForm.controls['totalPrice'].setValue(
      oldTotalPrice + newPrice - oldPrice
    );
  }

  updateUserGroceryListBasicDetails() {
    let invalid = false;

    for (const controlName of ['name', 'description']) {
      if (this.userGroceryListForm.controls[controlName].invalid) {
        invalid = true;

        break;
      }
    }

    if (invalid) {
    } else {
      this.disableInteraction = true;

      const name = this.userGroceryListForm.controls['name'].value;
      const description =
        this.userGroceryListForm.controls['description'].value;

      let userGroceryListUpdationPayload: GroceryListUpdationPayload = {};

      if (name !== this.initialUserGroceryListFormValues.name) {
        userGroceryListUpdationPayload.name = name;
      }

      if (description !== this.initialUserGroceryListFormValues.description) {
        userGroceryListUpdationPayload.description = description;
      }

      this.groceryListService
        .updatePatchUserGroceryList(this.id, userGroceryListUpdationPayload)
        .subscribe({
          next: () => {
            this.disableInteraction = false;

            this.messageService.add({
              key: 'tr',
              severity: 'success',
              summary: 'Success',
              detail: 'Grocery list updated successfully',
            });

            this.disableUserGroceryListBasicFormUpdation = true;
          },
          error: (error) => {
            this.disableInteraction = false;

            this.messageService.add({
              key: 'tr',
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to update grocery list',
            });

            this.disableUserGroceryListBasicFormUpdation = true;
          },
        });
    }
  }

  deleteUserGroceryList() {
    this.groceryListService.deleteUserGroceryList(this.id!).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }

  exportUserGroceryListSummary() {
    this.groceryListService.exportUserGroceryListSummary(this.id!).subscribe({
      next: (response: UserGroceryListSummaryExportResponse) => {
        window.open(response.download_url, '_blank');
      },
    });
  }
}
