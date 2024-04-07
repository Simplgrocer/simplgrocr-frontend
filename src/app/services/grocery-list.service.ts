import { Injectable } from '@angular/core';
import { GroceryList, GroceryListItem, database } from '../database/database';

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

  async getList() {
    const list = await database.groceryLists.toArray();

    return list;
  }

  async addList(groceryList: GroceryList) {
    await database.groceryLists.add(groceryList);
  }

  async addListItems(groceryListItems: GroceryListItem[]) {
    await database.groceryListItems.bulkAdd(groceryListItems)
  }
}
