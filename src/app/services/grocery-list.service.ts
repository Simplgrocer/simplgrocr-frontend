import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {
  constructor() {}

  getItemPrice(
    rateMeasurementQuantity: number,
    rateMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram',
    rate: number,
    quantityMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram',
    quantity: number
  ): number {
    if (rateMeasurementUnit === 'Unit') {
       
    }

    return 200;

  }
}
