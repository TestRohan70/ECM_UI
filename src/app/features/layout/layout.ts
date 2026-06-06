import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  private router = inject(Router);

  navItems = [
    { label: 'Dashboard',  icon: 'dashboard',  route: '/dashboard' },
    { label: 'Products',   icon: 'products',   route: '/products/add' },
    { label: 'Categories', icon: 'categories', route: '/categories' },
    { label: 'Brands',     icon: 'brands',     route: '/brands' },
    { label: 'Stores',     icon: 'stores',     route: '/stores' },
    { label: 'Orders',     icon: 'orders',     route: '/orders' },
    { label: 'Customers',  icon: 'customers',  route: '/customers' },
    { label: 'Inventory',  icon: 'inventory',  route: '/inventory' },
    { label: 'Reports',    icon: 'reports',    route: '/reports' },
    { label: 'Settings',   icon: 'settings',   route: '/settings' },
  ];

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
