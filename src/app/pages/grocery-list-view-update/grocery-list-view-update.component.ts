import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
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
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CenteredProgressSpinnerLgComponent } from '../../components/centered-progress-spinner-lg/centered-progress-spinner-lg.component';
import { ProgressSpinnerLgComponent } from '../../components/progress-spinner-lg/progress-spinner-lg.component';
import { ProgressSpinnerSmComponent } from '../../components/progress-spinner-sm/progress-spinner-sm.component';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import {
  GroceryListService,
  GroceryListUpdationPayload,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';
import { ErrorComponent } from '../../components/error/error.component';

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

  edit = false;

  id: string | undefined;
  userGroceryList: UserGroceryListResponse | undefined;
  userGroceryListForm: FormGroup | undefined;

  constructor(
    private route: ActivatedRoute,
    private groceryListService: GroceryListService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService
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
              this.edit &&
              (nameChanged || descriptionChanged)
            );

            this.disableUserGroceryListBasicFormUpdationPreviousState =
              this.disableUserGroceryListBasicFormUpdation;
          });

          this.userGroceryListBasicFormInitialized = true;
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

  onEditChange(value: boolean): void {
    if (!value) {
      this.disableUserGroceryListBasicFormUpdation = true;
    } else {
      if (!this.disableUserGroceryListBasicFormUpdationPreviousState) {
        this.disableUserGroceryListBasicFormUpdation = false;
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
        next: () => {
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

        const fileName = `${this.userGroceryListForm!.controls['name'].value} ${Date.now()}.pdf`;
        
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
}
