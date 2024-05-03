import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { GroceryListCreateComponent } from './pages/grocery-list-create/grocery-list-create.component';
import { GroceryListViewUpdateComponent } from './pages/grocery-list-view-update/grocery-list-view-update.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canActivate: [authGuard],
    title: 'Simplgrocr',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'grocery-list',
    component: GroceryListCreateComponent,
    canActivate: [authGuard],
    title: 'Grocery list',
  },
  {
    path: 'grocery-list/:id',
    component: GroceryListViewUpdateComponent,
    canActivate: [authGuard],
    title: 'Grocery list',
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
    title: 'Page not found',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Page not found',
  },
];
