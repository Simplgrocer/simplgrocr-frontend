import Dexie, { Table } from 'dexie';

export interface GroceryList {
  id?: number;
  name: string;
}

export interface GroceryListItem {
  id?: number;
  groceryListId: number;
  name: string;
  rateMeasurementQuantity: number;
  rateMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram';
  rate: number;
  quantityMeasurementUnit: 'Unit' | 'Kilogram' | 'Gram';
  quantity: number;
  price: number;
}

export class DexieDB extends Dexie {
  groceryListItems!: Table<GroceryListItem, number>;
  groceryLists!: Table<GroceryList, number>;

  constructor() {
    super('simplgrocr');

    this.version(2).stores({
      groceryLists: '++id',
      groceryListItems: '++id, groceryListId',
    });
  }
}

export const database = new DexieDB();
