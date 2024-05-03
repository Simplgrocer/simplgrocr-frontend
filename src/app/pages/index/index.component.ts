import { Component, OnInit } from '@angular/core';
import {
  GroceryListService,
  UserGroceryListResponse,
} from '../../services/grocery-list.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CenteredProgressSpinnerLgComponent } from '../../components/centered-progress-spinner-lg/centered-progress-spinner-lg.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CardModule, ButtonModule, CenteredProgressSpinnerLgComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  disableInteraction = true;
  groceryLists: UserGroceryListResponse[] = [];

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
