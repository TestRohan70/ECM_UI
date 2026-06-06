import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);
  private productSvc = inject(ProductService);

  productId: number | null = null;

  /* ── UI state ── */
  isLoadingProduct = true;
  isSubmitting     = false;
  loadError        = '';
  successMessage   = '';
  errorMessage     = '';

  /* ── Form fields ── */
  productName   = '';
  categoryId: number | null = null;
  brand         = '';
  description   = '';
  sku           = '';
  price: number | null         = null;
  discountPrice: number | null = null;
  weight: number | null        = null;
  isFeatured    = false;
  isActive      = true;
  imageUrl      = '';

  readonly categories = [
    { id: 1,  name: 'Electronics' },
    { id: 2,  name: 'Clothing & Fashion' },
    { id: 3,  name: 'Home & Furniture' },
    { id: 4,  name: 'Sports & Outdoors' },
    { id: 5,  name: 'Books & Media' },
    { id: 6,  name: 'Toys & Games' },
    { id: 7,  name: 'Health & Beauty' },
    { id: 8,  name: 'Automotive' },
    { id: 9,  name: 'Food & Grocery' },
    { id: 10, name: 'Jewelry & Accessories' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.loadError = 'Invalid product ID.';
      this.isLoadingProduct = false;
      return;
    }
    this.productId = id;
    this.fetchProduct(id);
  }

  private fetchProduct(id: number): void {
    this.isLoadingProduct = true;
    this.productSvc.getProductById(id).subscribe({
      next: (p: any) => {
        this.productName   = p.productName  ?? '';
        this.categoryId    = p.categoryId   ?? null;
        this.brand         = p.brand        ?? '';
        this.description   = p.description  ?? '';
        this.sku           = p.sku          ?? '';
        this.price         = p.price        ?? null;
        this.discountPrice = p.discountPrice ?? null;
        this.weight        = p.weight       ?? null;
        this.isFeatured    = p.isFeatured   ?? false;
        this.isActive      = p.isActive     ?? true;
        this.imageUrl      = p.imageUrl     ?? '';
        this.isLoadingProduct = false;
      },
      error: () => {
        this.loadError = 'Product not found or server error.';
        this.isLoadingProduct = false;
      }
    });
  }

  goBack(): void { this.router.navigate(['/products']); }

  saveProduct(): void {
    this.errorMessage   = '';
    this.successMessage = '';

    if (!this.productName.trim()) {
      this.errorMessage = 'Product Name is required.';
      return;
    }
    if (!this.categoryId) {
      this.errorMessage = 'Please select a Category.';
      return;
    }
    if (!this.price || this.price <= 0) {
      this.errorMessage = 'A valid Price is required.';
      return;
    }
    if (this.discountPrice !== null && this.discountPrice > this.price) {
      this.errorMessage = 'Discount price must be ≤ the selling price.';
      return;
    }

    const payload = {
      productName:   this.productName.trim(),
      categoryId:    this.categoryId,
      brand:         this.brand.trim()       || null,
      description:   this.description.trim() || null,
      sku:           this.sku.trim()         || null,
      price:         this.price,
      discountPrice: this.discountPrice      ?? null,
      weight:        this.weight             ?? null,
      isFeatured:    this.isFeatured,
      isActive:      this.isActive,
      imageUrl:      this.imageUrl.trim()    || null,
    };

    this.isSubmitting = true;
    this.productSvc.updateProduct(this.productId!, payload).subscribe({
      next: () => {
        this.isSubmitting   = false;
        this.successMessage = 'Product updated successfully!';
        setTimeout(() => this.router.navigate(['/products']), 1800);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update product. Please try again.';
      }
    });
  }
}
