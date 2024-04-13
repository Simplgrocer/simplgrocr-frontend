import { Injectable } from '@angular/core';
import { GroceryList, GroceryListItem, database } from '../database/database';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface UserGroceryListsResponse {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {
  constructor(private httpClient: HttpClient) {}

  getUserGroceryLists(): Observable<UserGroceryListsResponse[]> {
    return this.httpClient.get<UserGroceryListsResponse[]>(
      'https://849a228e-f159-4506-9d67-9293b11bc6a5.mock.pstmn.io/api/user/grocery-lists'
    );
  }

  getItemPrice(
    rateMeasurementQuantity: number,
    rateMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram',
    rate: number,
    quantityMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram',
    quantity: number
  ): number {
    let price: number = 0;

    if (rateMeasurementUnit === 'Unit') {
      price =
        rateMeasurementQuantity < 2
          ? rate * quantity
          : Number(((rate / rateMeasurementQuantity) * quantity).toFixed(2));
    }

    return price;
  }

  async getList() {
    const list = await database.groceryLists.toArray();

    return list;
  }

  async addList(groceryList: GroceryList) {
    await database.groceryLists.add(groceryList);
  }

  async addListItems(groceryListItems: GroceryListItem[]) {
    await database.groceryListItems.bulkAdd(groceryListItems);
  }
}
