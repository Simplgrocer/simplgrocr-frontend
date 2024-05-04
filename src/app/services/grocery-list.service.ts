import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

export interface GroceryListItemCreationPayload {
  name: string;
  description?: string;
  rate_measurement_quantity: number;
  rate_measurement_unit: 'Unit' | 'Kilogram' | 'Gram';
  rate: number;
  quantity_measurement_unit: 'Unit' | 'Kilogram' | 'Gram';
  quantity: number;
  price: number;
}

export interface GroceryListItemUpdationPayload {
  name?: string;
  description?: string;
  rate_measurement_quantity?: number;
  rate_measurement_unit?: 'Unit' | 'Kilogram' | 'Gram';
  rate?: number;
  quantity_measurement_unit?: 'Unit' | 'Kilogram' | 'Gram';
  quantity?: number;
  price?: number;
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
  generateUserGroceryListBasicFormObjectMetadata(
    response: UserGroceryListResponse
  ) {
    return [
      {
        name: 'name',
        label: 'Name',
        value: response.name,
        type: 'text',
        validators: {
          required: true,
        },
      },
    ];
  }

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

  exportUserGroceryListSummary(id: string): Observable<Blob> {
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
      }
    );
  }

  getUserGroceryListItems(
    id: string
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
    groceryListItem: GroceryListItemCreationPayload
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

  updatePatchUserGroceryListItem(
    groceryListID: string,
    groceryListItemID: string,
    groceryList: GroceryListItemUpdationPayload
  ): Observable<UserGroceryListItemResponse> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });

    return this.httpClient.patch<UserGroceryListItemResponse>(
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
    if (
      (rateMeasurementUnit === 'Unit' &&
        (quantityMeasurementUnit === 'Kilogram' ||
          quantityMeasurementUnit === 'Gram')) ||
      (quantityMeasurementUnit === 'Unit' &&
        (rateMeasurementUnit === 'Kilogram' || rateMeasurementUnit === 'Gram'))
    ) {
      throw new Error();
    }

    let price: number = 0;

    if (rateMeasurementUnit === 'Unit') {
      price =
        rateMeasurementQuantity < 2
          ? rate * quantity
          : Number(((rate / rateMeasurementQuantity) * quantity).toFixed(2));
    } else {
      if (rateMeasurementUnit === 'Kilogram') {
        if (quantityMeasurementUnit === 'Gram') {
          rateMeasurementQuantity = rateMeasurementQuantity * 1000;
        }

        price = (rate / rateMeasurementQuantity) * quantity;
      } else if (rateMeasurementUnit === 'Gram') {
        if (quantityMeasurementUnit == 'Kilogram') {
          rateMeasurementQuantity = rateMeasurementQuantity / 1000;
        }

        price = (rate / rateMeasurementQuantity) * quantity;
      }
    }

    if (Number.isNaN(price)) {
      return 0;
    }

    return price;
  }
}
