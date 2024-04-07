import { Component, OnInit } from '@angular/core';
import { GroceryListService } from '../../services/grocery-list.service';
import { GroceryList } from '../../database/database';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  groceryLists: GroceryList[] = [];

  constructor(private grocerylistService: GroceryListService) {}

  async ngOnInit(): Promise<void> {
    const list = await this.grocerylistService.getList();

    this.groceryLists = list;
  }
}
