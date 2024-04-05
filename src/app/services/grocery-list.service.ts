import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {
  constructor() {}

  getItemPrice(
    quantityMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram',
    quantity: number,
    rateMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram',
    rate: number
  ): number {
    return 210;
  }
}
