import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(m => m.Login)
  },

  /* ─── Protected shell: sidebar layout wraps all app pages ─── */
  {
    path: '',
    loadComponent: () =>
      import('./features/layout/layout').then(m => m.Layout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./features/products/add-product/add-product').then(m => m.AddProduct)
      },
      /* Placeholder redirect for bare /products */
      {
        path: 'products',
        redirectTo: 'products/add',
        pathMatch: 'full'
      }
    ]
  },

  /* Catch-all fallback */
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
