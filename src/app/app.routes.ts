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

  /* ─── Authenticated shell: sidebar layout wraps all pages ─── */
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
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list').then(m => m.ProductList)
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./features/products/add-product/add-product').then(m => m.AddProduct)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/products/edit-product/edit-product').then(m => m.EditProduct)
      }
    ]
  },

  /* Catch-all */
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
