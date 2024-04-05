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
    console.log(rateMeasurementQuantity, rateMeasurementUnit, rate, quantityMeasurementUnit, quantity)

    let price: number = 0;

    if (rateMeasurementUnit === 'Unit') {
      price = rateMeasurementQuantity < 2 ? rate * quantity : Number(((rate / rateMeasurementQuantity) * quantity).toFixed(2));
    }

    return price;
  }
}
