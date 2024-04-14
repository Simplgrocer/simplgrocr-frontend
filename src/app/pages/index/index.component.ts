import { Component, OnInit } from '@angular/core';
import { GroceryListService, UserGroceryListResponse } from '../../services/grocery-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  groceryLists: UserGroceryListResponse[] = [];

  constructor(private router: Router, private groceryListService: GroceryListService) {}

  ngOnInit() {
    this.groceryListService.getUserGroceryLists().subscribe({
      next: (response: UserGroceryListResponse[]) => {
        this.groceryLists = response;
      }
    });
  }

  expandUserGroceryList(id: number) {
    this.router.navigate([`grocery-list/${id}`]);
  }
}
