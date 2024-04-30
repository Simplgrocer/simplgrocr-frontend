import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { ToastModule } from 'primeng/toast';
import { CenteredProgressSpinnerComponent } from '../../components/centered-progress-spinner/centered-progress-spinner.component';
import { ContentEditableDirective } from '../../directives/content-editable.directive';
import { GroceryListService } from '../../services/grocery-list.service';
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
    CenteredProgressSpinnerComponent,
  ],
  templateUrl: './grocery-list-view-update.component.html',
  styleUrl: './grocery-list-view-update.component.css',
})
export class GroceryListViewUpdateComponent implements OnInit {
  disableInteraction = false;

  id: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private groceryListService: GroceryListService,
    private router: Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.disableInteraction = true;

    this.id = this.route.snapshot.url[1].path;

    this.primengConfig.ripple = true;

    if (this.id) {
      this.groceryListService.getUserGroceryList(this.id).subscribe({
        error: (error) => {
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        },
      });
    }
  }
}
