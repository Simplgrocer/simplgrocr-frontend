import { Component, OnInit } from '@angular/core';
import { GroceryListService, UserGroceryListsResponse } from '../../services/grocery-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  groceryLists: UserGroceryListsResponse[] = [];

  constructor(private router: Router, private groceryListService: GroceryListService) {}

  ngOnInit() {
    this.groceryListService.getUserGroceryLists().subscribe({
      next: (response: UserGroceryListsResponse[]) => {
        this.groceryLists = response;
      }
    });
  }

  expandUserGroceryList(index: number) {
    this.router.navigate([`grocery-list/${index}`]);
  }
}
