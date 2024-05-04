import { Component, OnInit } from '@angular/core';
import {
  GroceryListService,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CenteredProgressSpinnerLgComponent } from '../../components/centered-progress-spinner-lg/centered-progress-spinner-lg.component';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    MessagesModule,
    CenteredProgressSpinnerLgComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  disableInteraction = true;
  groceryLists: UserGroceryListResponse[] = [];

  itemsNotFoundBanner = [
    {
      severity: 'info',
      detail:
        'This section is pretty empty. Please add some items to your grocery list.',
    },
  ];

  constructor(
    private router: Router,
    private groceryListService: GroceryListService
  ) {}

  ngOnInit() {
    this.groceryListService.getUserGroceryLists().subscribe({
      next: (response: UserGroceryListResponse[]) => {
        this.groceryLists = response;

        this.disableInteraction = false;
      },
    });
  }

  directToGroceryListPage() {
    this.router.navigate([`grocery-list`]);
  }

  expandUserGroceryList(id: number) {
    this.router.navigate([`grocery-list/${id}`]);
  }
}
