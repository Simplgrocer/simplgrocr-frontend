import { Injectable } from '@angular/core';
import { GroceryListItem, database } from '../database/database';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface GroceryListCreationPayload {
  name: string;
  description?: string;
  total_price: number;
}

export interface GroceryListUpdationPayload {
  name?: string;
  description?: string;
  total_price?: number;
}

export interface GroceryListItemCreationUpdationPayload {
  name: string;
  description?: string;
  rate_measurement_quantity: number;
  rate_measurement_unit: 'Unit' | 'Kilogram' | 'Gram';
  rate: number;
  quantity_measurement_unit: 'Unit' | 'Kilogram' | 'Gram';
  quantity: number;
  price: number;
  grocery_list: number;
}

export interface UserGroceryListResponse {
  id: number;
  name: string;
  description: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  user: number;
}

export interface UserGroceryListSummaryExportResponse {
  download_url: string;
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
  token!: string;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.token = this.authService.getAuthToken();
  }

  getUserGroceryLists(): Observable<UserGroceryListResponse[]> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.get<UserGroceryListResponse[]>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists`,
      {
        headers: headers,
      }
    );
  }

  getUserGroceryList(id: string): Observable<UserGroceryListResponse> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.get<UserGroceryListResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${id}`,
      {
        headers: headers,
      }
    );
  }

  createUserGroceryList(
    groceryList: GroceryListCreationPayload
  ): Observable<UserGroceryListResponse> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.post<UserGroceryListResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/`,
      groceryList,
      {
        headers: headers,
      }
    );
  }

  updatePatchUserGroceryList(
    id: string,
    groceryList: GroceryListUpdationPayload
  ): Observable<UserGroceryListResponse> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.patch<UserGroceryListResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${id}/`,
      groceryList,
      {
        headers: headers,
      }
    );
  }

  deleteUserGroceryList(id: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.delete<void>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${id}`,
      {
        headers: headers,
      }
    );
  }

  exportUserGroceryListSummary(
    id: string
  ): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.get(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${id}/summary/`,
      {
        responseType: 'blob',
        headers: headers,
      },

    );
  }

  getUserGroceryListItems(
    id: number
  ): Observable<UserGroceryListItemResponse[]> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.get<UserGroceryListItemResponse[]>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${id}/items`,
      {
        headers: headers,
      }
    );
  }

  createUserGroceryListItem(
    groceryListID: string,
    groceryListItem: GroceryListItemCreationUpdationPayload
  ): Observable<UserGroceryListItemResponse> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.post<UserGroceryListItemResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${groceryListID}/items/`,
      groceryListItem,
      {
        headers: headers,
      }
    );
  }

  updatePutUserGroceryListItem(
    groceryListID: string,
    groceryListItemID: string,
    groceryList: GroceryListItemCreationUpdationPayload
  ): Observable<UserGroceryListItemResponse> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.put<UserGroceryListItemResponse>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${groceryListID}/items/${groceryListItemID}/`,
      groceryList,
      {
        headers: headers,
      }
    );
  }

  deleteUserGroceryListItem(
    groceryListID: string,
    groceryListItemID: string
  ): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.delete<void>(
      `${import.meta.env['NG_APP_API_BASE_URL']}/${
        import.meta.env['NG_APP_API_PREFIX']
      }/users/grocery-lists/${groceryListID}/items/${groceryListItemID}/`,
      {
        headers: headers,
      }
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

  async addListItems(groceryListItems: GroceryListItem[]) {
    await database.groceryListItems.bulkAdd(groceryListItems);
  }
}
