import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AccordionModule } from 'primeng/accordion';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CenteredProgressSpinnerLgComponent } from '../../components/centered-progress-spinner-lg/centered-progress-spinner-lg.component';
import { ErrorComponent } from '../../components/error/error.component';
import { ProgressSpinnerLgComponent } from '../../components/progress-spinner-lg/progress-spinner-lg.component';
import { ProgressSpinnerSmComponent } from '../../components/progress-spinner-sm/progress-spinner-sm.component';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import {
  GroceryListItemCreationPayload,
  GroceryListService,
  GroceryListUpdationPayload,
  UserGroceryListItemResponse,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';

interface MeasurementUnit {
  id: string;
  value: 'Unit' | 'Kilogram' | 'Gram';
}

@Component({
  selector: 'app-grocery-list-view-update',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
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
    ConfirmDialogModule,
    AccordionModule,
    DropdownModule,
    InputNumberModule,
    CommonModule,
    ToggleButtonModule,
    NgxSkeletonLoaderModule,
    ScrollTopModule,
    ErrorComponent,
    ProgressSpinnerSmComponent,
    ProgressSpinnerLgComponent,
    CenteredProgressSpinnerLgComponent,
  ],
  templateUrl: './grocery-list-view-update.component.html',
  styleUrl: './grocery-list-view-update.component.css',
})
export class GroceryListViewUpdateComponent implements OnInit {
  disableInteraction = false;
  error = false;

  userGroceryListBasicFormInitialized = false;
  disableUserGroceryListBasicFormUpdationPreviousState = true;
  disableUserGroceryListBasicFormUpdation = true;
  resetUserGroceryListBasicForm = false;

  userGroceryListBasicFormEdit = false;

  userGroceryListItemsFormArrayInitialized = false;

  id: string | undefined;
  userGroceryList: UserGroceryListResponse | undefined;
  userGroceryListItems: UserGroceryListItemResponse[] | undefined;

  userGroceryListItemActiveIndex = 0;

  userGroceryListForm: FormGroup | undefined;

  measurementUnits: MeasurementUnit[] = [
    { id: '1', value: 'Unit' },
    { id: '2', value: 'Kilogram' },
    { id: '3', value: 'Gram' },
  ];

  constructor(
    private route: ActivatedRoute,
    private groceryListService: GroceryListService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.url[1].path;

    this.primengConfig.ripple = true;

    if (this.id) {
      this.groceryListService.getUserGroceryList(this.id).subscribe({
        next: (response: UserGroceryListResponse) => {
          this.userGroceryList = response;

          this.userGroceryListForm = new FormGroup({
            name: new FormControl(response.name, [Validators.required]),
            description: new FormControl(response.description),
            totalPrice: new FormControl(response.total_price),
            items: new FormArray([]),
          });

          this.userGroceryListForm.valueChanges.subscribe(() => {
            const nameControl = this.userGroceryListForm!.get('name')!;
            const descriptionControl =
              this.userGroceryListForm!.get('description')!;

            const nameChanged =
              nameControl.value !== this.userGroceryList?.name;
            const descriptionChanged =
              descriptionControl.value !== this.userGroceryList?.description;

            const nameIsValid = nameControl.valid;
            const descriptionIsValid = descriptionControl.valid;

            this.disableUserGroceryListBasicFormUpdation = !(
              nameIsValid &&
              descriptionIsValid &&
              this.userGroceryListBasicFormEdit &&
              (nameChanged || descriptionChanged)
            );

            this.disableUserGroceryListBasicFormUpdationPreviousState =
              this.disableUserGroceryListBasicFormUpdation;

            this.resetUserGroceryListBasicForm =
              !this.disableUserGroceryListBasicFormUpdation;
          });

          this.userGroceryListBasicFormInitialized = true;

          this.groceryListService.getUserGroceryListItems(this.id!).subscribe({
            next: (response: UserGroceryListItemResponse[]) => {
              this.userGroceryListItems = response;

              response.map((item) => {
                (this.userGroceryListForm!.get('items') as FormArray).push(
                  new FormGroup({
                    name: new FormControl(item.name, [Validators.required]),
                    description: new FormControl(item.description),
                    rateMeasurementQuantity: new FormControl(
                      item.rate_measurement_quantity,
                      [Validators.required]
                    ),
                    rateMeasurementUnit: new FormControl(
                      this.measurementUnits.find(
                        (obj) => obj.value === item.rate_measurement_unit
                      ),
                      [Validators.required]
                    ),
                    rate: new FormControl(item.rate, [Validators.required]),
                    quantityMeasurementUnit: new FormControl(
                      this.measurementUnits.find(
                        (obj) => obj.value === item.quantity_measurement_unit
                      ),
                      [Validators.required]
                    ),
                    quantity: new FormControl(item.quantity, [
                      Validators.required,
                    ]),
                    price: new FormControl(item.price, [Validators.required]),
                    edit: new FormControl(false),
                    updatePreviousState: new FormControl(false),
                    updateCurrentState: new FormControl(false),
                    resetCurrentState: new FormControl(false),
                  })
                );
              });

              this.userGroceryListItemsFormArrayInitialized = true;
            },
            error: (error) => {
              if (error.status === 0) {
                this.error = true;
              } else if (error.status === 404) {
                this.router.navigate(['/not-found']);
              }
            },
          });
        },
        error: (error) => {
          if (error.status === 0) {
            this.error = true;
          } else if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        },
      });
    }
  }

  onUserGroceryListBasicFormEditButtonChange(value: boolean): void {
    if (!value) {
      this.disableUserGroceryListBasicFormUpdation = true;

      this.resetUserGroceryListBasicForm = false;
    } else {
      if (!this.disableUserGroceryListBasicFormUpdationPreviousState) {
        this.disableUserGroceryListBasicFormUpdation = false;

        this.resetUserGroceryListBasicForm = true;
      }
    }
  }

  updateUserGroceryListBasicDetails(): void {
    this.disableInteraction = true;

    const name = this.userGroceryListForm!.controls['name'].value;
    const description = this.userGroceryListForm!.controls['description'].value;

    let userGroceryListUpdationPayload: GroceryListUpdationPayload = {};

    if (name !== this.userGroceryList!.name) {
      userGroceryListUpdationPayload.name = name;
    }

    if (description !== this.userGroceryList!.description) {
      userGroceryListUpdationPayload.description = description;
    }

    this.groceryListService
      .updatePatchUserGroceryList(this.id!, userGroceryListUpdationPayload)
      .subscribe({
        next: (response: UserGroceryListResponse) => {
          this.userGroceryList = response;

          this.disableInteraction = false;

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

  resetUserGroceryListFormBasicDetails(): void {
    this.userGroceryListForm!.patchValue({
      name: this.userGroceryList!.name,
      description: this.userGroceryList!.description,
    });

    this.resetUserGroceryListBasicForm = false;
  }

  deleteUserGroceryList() {
    this.confirmationService.confirm({
      header: `Delete ${this.userGroceryListForm!.controls['name'].value}`,
      message: 'Are you sure that you want to perform this action?',
      defaultFocus: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: '',
      accept: () => {
        this.disableInteraction = true;

        this.groceryListService.deleteUserGroceryList(this.id!).subscribe({
          next: () => {
            this.disableInteraction = false;

            this.router.navigate(['/']);
          },
          error: (error) => {
            this.disableInteraction = false;

            this.messageService.add({
              key: 'tr',
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to delete grocery list',
            });
          },
        });
      },
      reject: () => {},
    });
  }

  exportUserGroceryListSummary() {
    this.disableInteraction = true;

    this.groceryListService.exportUserGroceryListSummary(this.id!).subscribe({
      next: (response: Blob) => {
        const downloadLink = document.createElement('a');

        const fileName = `${
          this.userGroceryListForm!.controls['name'].value
        } ${Date.now()}.pdf`;

        downloadLink.href = window.URL.createObjectURL(response);
        downloadLink.download = fileName;

        downloadLink.dispatchEvent(new MouseEvent('click'));

        this.disableInteraction = false;
      },
      error: (error) => {
        this.disableInteraction = false;

        this.messageService.add({
          key: 'tr',
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to export grocery list',
        });
      },
    });
  }

  getItemsArrayControls(): AbstractControl<any, any>[] {
    return (this.userGroceryListForm!.get('items') as FormArray).controls;
  }

  deleteUserGroceryListItem(index: number): void {
    this.confirmationService.confirm({
      header: `Delete ${this.userGroceryListItems![index].name}`,
      message: 'Are you sure that you want to perform this action?',
      defaultFocus: 'none',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: '',
      accept: () => {
        this.disableInteraction = true;

        const userGroceryListItemsFormArray = this.userGroceryListForm!.get(
          'items'
        ) as FormArray;

        const id = this.userGroceryListItems![index].id;

        const oldPrice = (
          userGroceryListItemsFormArray.controls[index] as FormGroup
        ).controls['price'].value;

        this.groceryListService
          .deleteUserGroceryListItem(this.id!, id as unknown as string)
          .subscribe({
            next: () => {
              this.userGroceryListItems!.splice(index, 1);

              (this.userGroceryListForm!.get('items') as FormArray).removeAt(
                index
              );

              this.userGroceryListForm!.controls['totalPrice'].setValue(
                this.userGroceryListForm!.controls['totalPrice'].value -
                  oldPrice
              );

              this.disableInteraction = false;
            },
            error: (error) => {
              this.disableInteraction = false;

              this.messageService.add({
                key: 'tr',
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to delete item',
              });
            },
          });
      },
      reject: () => {},
    });
  }

  addUserGroceryListItem(): void {
    this.disableInteraction = true;

    const groceryListItemObject: GroceryListItemCreationPayload = {
      name: '',
      description: '',
      rate_measurement_quantity: 0,
      rate_measurement_unit: 'Unit',
      rate: 0,
      quantity_measurement_unit: 'Unit',
      quantity: 0,
      price: 0,
    };

    this.groceryListService
      .createUserGroceryListItem(this.id!, groceryListItemObject)
      .subscribe({
        next: (response: UserGroceryListItemResponse) => {
          this.userGroceryListItems!.push(response);

          (this.userGroceryListForm!.get('items') as FormArray).push(
            new FormGroup({
              name: new FormControl(response.name, [Validators.required]),
              description: new FormControl(response.description),
              rateMeasurementQuantity: new FormControl(
                response.rate_measurement_quantity,
                [Validators.required]
              ),
              rateMeasurementUnit: new FormControl(
                this.measurementUnits.find(
                  (obj) => obj.value === response.rate_measurement_unit
                ),
                [Validators.required]
              ),
              rate: new FormControl(response.rate, [Validators.required]),
              quantityMeasurementUnit: new FormControl(
                this.measurementUnits.find(
                  (obj) => obj.value === response.quantity_measurement_unit
                ),
                [Validators.required]
              ),
              quantity: new FormControl(response.quantity, [
                Validators.required,
              ]),
              price: new FormControl(response.price, [Validators.required]),
              edit: new FormControl(false),
              updatePreviousState: new FormControl(false),
              updateCurrentState: new FormControl(false),
              resetCurrentState: new FormControl(false),
            })
          );

          this.disableInteraction = false;

          // this.userGroceryListItemActiveIndex =
          //   this.userGroceryListItems!.length - 1;

          // const accordionElement = document.querySelector(
          //   `.accordion-tab[data-index="${this.userGroceryListItemActiveIndex}"]`
          // );

          // if (accordionElement) {
          //   accordionElement.scrollIntoView({
          //     behavior: 'smooth',
          //     block: 'start',
          //   });
          // }
        },
        error: (error) => {
          this.disableInteraction = false;

          this.messageService.add({
            key: 'tr',
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to add item',
          });
        },
      });
  }

  onUserGroceryListItemPropChange(index: number): void {
    if (this.userGroceryListItems) {
      const nameControl = this.getItemsArrayControls()[index].get('name')!;
      const descriptionControl =
        this.getItemsArrayControls()[index].get('description')!;
      const rateMeasurementQuantityControl = this.getItemsArrayControls()[
        index
      ].get('rateMeasurementQuantity')!;
      const rateMeasurementUnitControl = this.getItemsArrayControls()[
        index
      ].get('rateMeasurementUnit')!;
      const rateControl = this.getItemsArrayControls()[index].get('rate')!;
      const quantityMeasurementUnitControl = this.getItemsArrayControls()[
        index
      ].get('quantityMeasurementUnit')!;
      const quantityControl =
        this.getItemsArrayControls()[index].get('quantity')!;

      const nameChanged =
        nameControl.value !== this.userGroceryListItems[index].name;
      const descriptionChanged =
        descriptionControl.value !==
        this.userGroceryListItems[index].description;
      const rateMeasurementQuantityChanged =
        rateMeasurementQuantityControl.value !==
        this.userGroceryListItems[index].rate_measurement_quantity;
      const rateMeasurementUnitChanged =
        rateMeasurementUnitControl.value !==
        this.userGroceryListItems[index].rate_measurement_unit;
      const rateChanged =
        rateControl.value !== this.userGroceryListItems[index].rate;
      const quantityMeasurementUnitChanged =
        quantityMeasurementUnitControl.value !==
        this.userGroceryListItems[index].quantity_measurement_unit;
      const quantityChanged =
        quantityControl.value !== this.userGroceryListItems[index].quantity;

      const nameValid = nameControl.valid;
      const descriptionValid = descriptionControl.valid;
      const rateMeasurementQuantityValid = rateMeasurementQuantityControl.valid;
      const rateMeasurementUnitValid = rateMeasurementUnitControl.valid;
      const rateValid = rateControl.valid;
      const quantityMeasurementUnitValid = quantityMeasurementUnitControl.valid;
      const quantityValid = quantityControl.valid;

      const updateState =
        nameValid &&
        descriptionValid &&
        rateMeasurementQuantityValid &&
        rateMeasurementUnitValid &&
        rateValid &&
        quantityMeasurementUnitValid &&
        quantityValid &&
        this.getItemsArrayControls()[index].get('edit')!.value &&
        (nameChanged ||
          descriptionChanged ||
          rateMeasurementQuantityChanged ||
          rateMeasurementUnitChanged ||
          rateChanged ||
          quantityMeasurementUnitChanged ||
          quantityChanged);

      this.getItemsArrayControls()[index].patchValue({
        updatePrevState: updateState,
        updateCurrentState: updateState,
        resetCurrentState: updateState,
      });
    }
  }

  resetUserGroceryLisItem(index: number) {}

  updateUserGroceryListItem(index: number): void {
    if (this.userGroceryListItems) {
      this.disableInteraction = true;

      const id = this.userGroceryListItems[index].id;

      const nameControl = this.getItemsArrayControls()[index].get('name')!;
      const descriptionControl =
        this.getItemsArrayControls()[index].get('description')!;
      const rateMeasurementQuantityControl = this.getItemsArrayControls()[
        index
      ].get('rateMeasurementQuantity')!;
      const rateMeasurementUnitControl = this.getItemsArrayControls()[
        index
      ].get('rateMeasurementUnit')!;
      const rateControl = this.getItemsArrayControls()[index].get('rate')!;
      const quantityMeasurementUnitControl = this.getItemsArrayControls()[
        index
      ].get('quantityMeasurementUnit')!;
      const quantityControl =
        this.getItemsArrayControls()[index].get('quantity')!;

      const nameChanged =
        nameControl.value !== this.userGroceryListItems[index].name;
      const descriptionChanged =
        descriptionControl.value !==
        this.userGroceryListItems[index].description;
      const rateMeasurementQuantityChanged =
        rateMeasurementQuantityControl.value !==
        this.userGroceryListItems[index].rate_measurement_quantity;
      const rateMeasurementUnitChanged =
        rateMeasurementUnitControl.value.value !==
        this.userGroceryListItems[index].rate_measurement_unit;
      const rateChanged =
        rateControl.value !== this.userGroceryListItems[index].rate;
      const quantityMeasurementUnitChanged =
        quantityMeasurementUnitControl.value.value !==
        this.userGroceryListItems[index].quantity_measurement_unit;
      const quantityChanged =
        quantityControl.value !== this.userGroceryListItems[index].quantity;

      const userGroceryListItemPayload = {
        ...(nameChanged ? { name: nameControl.value } : {}),
        ...(descriptionChanged
          ? { description: descriptionControl.value }
          : {}),
        ...(rateMeasurementQuantityChanged
          ? {
              rate_measurement_quantity: rateMeasurementQuantityControl.value,
            }
          : {}),
        ...(rateMeasurementUnitChanged
          ? {
              rate_measurement_unit: rateMeasurementUnitControl.value.value,
            }
          : {}),
        ...(rateChanged ? { rate: rateControl.value } : {}),
        ...(quantityMeasurementUnitChanged
          ? {
              quantity_measurement_unit: quantityMeasurementUnitControl.value.value,
            }
          : {}),
        ...(quantityChanged ? { quantity: quantityControl.value } : {}),
      };

      this.groceryListService
        .updatePatchUserGroceryListItem(this.id!, id as unknown as string, userGroceryListItemPayload)
        .subscribe({
          next: (response: UserGroceryListItemResponse) => {
            this.userGroceryListItems![index] = response;

            this.disableInteraction = false;
          },
          error: (error) => {
            this.disableInteraction = false;

            this.messageService.add({
              key: 'tr',
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to update item',
            });
          },
        });
    }
  }
}
