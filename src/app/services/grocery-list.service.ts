import { Injectable } from '@angular/core';
import { GroceryList, GroceryListItem, database } from '../database/database';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface UserGroceryListResponse {
  id: number;
  name: string;
  description: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface UserGroceryListItemResponse {
  id: number;
  name: string;
  description: string;
  rate_measurement_quantity: number;
  rate_measurement_unit: 'Unit' | 'Kilogram' | 'Gram';
  rate: number;
  quantity_measurement_unit: 'Unit' | 'Kilogram' | 'Gram';
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  grocery_list: number;
}

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {
  token !: string;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.token = this.authService.getAuthToken()
  }

  getUserGroceryLists(): Observable<UserGroceryListResponse[]> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    });

    return this.httpClient.get<UserGroceryListResponse[]>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${import.meta.env['NG_APP_API_PREFIX']}/users/grocery-lists`,
      {
        headers: headers
      }
    );
  }

  getUserGroceryList(id: string): Observable<UserGroceryListResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.token}`,
    });

    return this.httpClient.get<UserGroceryListResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${import.meta.env['NG_APP_API_PREFIX']}/users/grocery-lists/${id}`,
      {
        headers: headers
      }
    );
  }

  getUserGroceryListItems(
    id: string
  ): Observable<UserGroceryListItemResponse[]> {
    return this.httpClient.get<UserGroceryListItemResponse[]>(
      `https://849a228e-f159-4506-9d67-9293b11bc6a5.mock.pstmn.io/api/user/grocery-lists/${id}/items`
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
    } else {
      const conversionFactor =
        (rateMeasurementUnit === 'Kilogram' &&
          quantityMeasurementUnit === 'Kilogram') ||
        (rateMeasurementUnit === 'Gram' && quantityMeasurementUnit === 'Gram')
          ? 1
          : 1000;

      price = rate * (quantity / conversionFactor);
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
