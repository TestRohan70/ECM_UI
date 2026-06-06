import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product';

export interface Product {
  id: number;
  categoryId: number | null;
  productName: string;
  slug: string | null;
  description: string | null;
  price: number;
  discountPrice: number | null;
  sku: string | null;
  imageUrl: string | null;
  isFeatured: boolean | null;
  isActive: boolean | null;
  createdDate: string | null;
  brand: string | null;
  weight: number | null;
  isDeleted: boolean;
}

type SortOption   = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';
type StatusFilter = 'all' | 'active' | 'inactive';

const CATEGORY_MAP: Record<number, string> = {
  1:  'Electronics',
  2:  'Clothing & Fashion',
  3:  'Home & Furniture',
  4:  'Sports & Outdoors',
  5:  'Books & Media',
  6:  'Toys & Games',
  7:  'Health & Beauty',
  8:  'Automotive',
  9:  'Food & Grocery',
  10: 'Jewelry & Accessories',
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private router     = inject(Router);
  private productSvc = inject(ProductService);

  /* ── State ── */
  allProducts: Product[] = [];
  isLoading  = true;
  loadError  = '';

  /* ── Filters ── */
  searchText      = '';
  selectedCatId: number | '' = '';
  statusFilter: StatusFilter = 'all';
  sortBy: SortOption         = 'newest';

  /* ── Pagination ── */
  currentPage = 1;
  pageSize    = 10;

  /* ── Delete confirm ── */
  deletingId: number | null = null;
  isDeleting = false;

  readonly categories = Object.entries(CATEGORY_MAP).map(([id, name]) => ({
    id: Number(id), name
  }));

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest',     label: 'Newest First' },
    { value: 'oldest',     label: 'Oldest First' },
    { value: 'name-asc',   label: 'Name: A → Z' },
    { value: 'name-desc',  label: 'Name: Z → A' },
    { value: 'price-asc',  label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
  ];

  /* ── Computed ── */
  get visibleProducts(): Product[] {
    let list = this.allProducts.filter(p => !p.isDeleted);

    const q = this.searchText.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.productName.toLowerCase().includes(q) ||
        (p.sku   ?? '').toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q)
      );
    }

    if (this.selectedCatId !== '') {
      list = list.filter(p => p.categoryId === Number(this.selectedCatId));
    }

    if (this.statusFilter === 'active')   list = list.filter(p => p.isActive !== false);
    if (this.statusFilter === 'inactive') list = list.filter(p => p.isActive === false);

    switch (this.sortBy) {
      case 'newest':
        list = [...list].sort((a, b) =>
          new Date(b.createdDate ?? 0).getTime() - new Date(a.createdDate ?? 0).getTime());
        break;
      case 'oldest':
        list = [...list].sort((a, b) =>
          new Date(a.createdDate ?? 0).getTime() - new Date(b.createdDate ?? 0).getTime());
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'name-desc':
        list = [...list].sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
    }

    return list;
  }

  get pagedProducts():  Product[]         { const s = (this.currentPage - 1) * this.pageSize; return this.visibleProducts.slice(s, s + this.pageSize); }
  get totalPages():     number            { return Math.ceil(this.visibleProducts.length / this.pageSize); }
  get startIndex():     number            { return (this.currentPage - 1) * this.pageSize + 1; }
  get endIndex():       number            { return Math.min(this.currentPage * this.pageSize, this.visibleProducts.length); }
  get totalCount():     number            { return this.allProducts.filter(p => !p.isDeleted).length; }
  get activeCount():    number            { return this.allProducts.filter(p => !p.isDeleted && p.isActive !== false).length; }
  get inactiveCount():  number            { return this.allProducts.filter(p => !p.isDeleted && p.isActive === false).length; }
  get hasActiveFilters(): boolean         { return !!(this.searchText.trim() || this.selectedCatId !== '' || this.statusFilter !== 'all'); }

  get pageNumbers(): (number | 'dots')[] {
    const total = this.totalPages, current = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | 'dots')[] = [1];
    if (current > 3) pages.push('dots');
    const s = Math.max(2, current - 1), e = Math.min(total - 1, current + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (current < total - 2) pages.push('dots');
    pages.push(total);
    return pages;
  }

  /* ── Helpers ── */
  categoryName(id: number | null): string {
    return id ? (CATEGORY_MAP[id] ?? `Cat #${id}`) : '—';
  }

  formatDate(date: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  discountPct(p: Product): number | null {
    if (!p.discountPrice || !p.price) return null;
    return Math.round(((p.price - p.discountPrice) / p.price) * 100);
  }

  /* ── Lifecycle ── */
  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.isLoading = true;
    this.loadError = '';
    this.productSvc.getProducts().subscribe({
      next:  (data: any[]) => { this.allProducts = data; this.isLoading = false; },
      error: ()             => { this.loadError = 'Could not load products. Please check your connection and try again.'; this.isLoading = false; }
    });
  }

  /* ── Filter / Page actions ── */
  clearFilters(): void   { this.searchText = ''; this.selectedCatId = ''; this.statusFilter = 'all'; this.sortBy = 'newest'; this.currentPage = 1; }
  onFilterChange(): void { this.currentPage = 1; }
  onPageSizeChange(): void { this.currentPage = 1; }

  goToPage(page: number | 'dots'): void {
    if (page === 'dots' || page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Navigation ── */
  goToAdd():           void { this.router.navigate(['/products/add']); }
  goToEdit(id: number): void { this.router.navigate(['/products/edit', id]); }

  /* ── Delete ── */
  requestDelete(id: number): void { this.deletingId = id; }
  cancelDelete():             void { this.deletingId = null; }

  confirmDelete(id: number): void {
    this.isDeleting = true;
    this.productSvc.deleteProduct(id).subscribe({
      next: () => {
        this.allProducts = this.allProducts.filter(p => p.id !== id);
        this.deletingId  = null;
        this.isDeleting  = false;
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        }
      },
      error: () => { this.deletingId = null; this.isDeleting = false; }
    });
  }

  skeletonRows = Array(8).fill(0);
}
