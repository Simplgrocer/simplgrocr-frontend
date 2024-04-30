import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { CenteredProgressSpinnerLgComponent } from '../../components/centered-progress-spinner-lg/centered-progress-spinner-lg.component';
import { ProgressSpinnerLgComponent } from '../../components/progress-spinner-lg/progress-spinner-lg.component';
import { ProgressSpinnerSmComponent } from '../../components/progress-spinner-sm/progress-spinner-sm.component';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import {
  GroceryListService,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-grocery-list-view-update',
  standalone: true,
  providers: [MessageService, ConfirmationService],
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
    ConfirmDialogModule,
    AccordionModule,
    DropdownModule,
    InputNumberModule,
    CommonModule,
    SkeletonModule,
    NgxSkeletonLoaderModule,
    ProgressSpinnerSmComponent,
    ProgressSpinnerLgComponent,
    CenteredProgressSpinnerLgComponent,
  ],
  templateUrl: './grocery-list-view-update.component.html',
  styleUrl: './grocery-list-view-update.component.css',
})
export class GroceryListViewUpdateComponent implements OnInit {
  disableInteraction = false;
  userGroceryListBasicFormInitialized = false;

  id: string | undefined;
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
          this.userGroceryListForm = new FormGroup({
            name: new FormControl(response.name, [Validators.required]),
            description: new FormControl(response.description),
            totalPrice: new FormControl(response.total_price),
            items: new FormArray([]),
          });

          this.userGroceryListBasicFormInitialized = true;
        },
        error: (error) => {
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        },
      });
    }
  }
}
