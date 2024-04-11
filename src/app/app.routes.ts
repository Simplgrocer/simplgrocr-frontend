import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { GroceryListComponent } from './pages/grocery-list/grocery-list.component';
import { LoginComponent } from './components/login/login.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { authGuard } from './guards/auth.guard';

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
    path: 'grocery-list/:id?',
    component: GroceryListComponent,
    canActivate: [authGuard],
    title: 'Grocery list',
  },
];
