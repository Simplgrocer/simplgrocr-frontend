import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { GroceryListComponent } from './pages/grocery-list/grocery-list.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    title: 'Simplgrocr',
  },
  {
    path: 'grocery-list',
    component: GroceryListComponent,
    title: 'Grocery list'
  }
];
