import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { GroceryListCreateComponent } from './pages/grocery-list-create/grocery-list-create.component';
import { GroceryListViewUpdateComponent } from './pages/grocery-list-view-update/grocery-list-view-update.component';
import { IndexComponent } from './pages/index/index.component';
import { LoginComponent } from './pages/login/login.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    title: 'Simplgrocr',
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    title: 'Onboarding',
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
];
