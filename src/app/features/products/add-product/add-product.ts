import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product';

interface InventoryRow {
  storeId: number | null;
  stockQty: number;
}

interface ImageRow {
  imageUrl: string;
  displayOrder: number;
  previewError: boolean;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {
  private router  = inject(Router);
  private productSvc = inject(ProductService);

  isSubmitting  = false;
  successMessage = '';
  errorMessage   = '';

  productName   = '';
  categoryId: number | null = null;
  brand         = '';
  description   = '';
  sku           = '';
  price: number | null         = null;
  discountPrice: number | null = null;
  weight: number | null        = null;
  isFeatured    = false;

  inventories: InventoryRow[] = [
    { storeId: null, stockQty: 0 }
  ];

  images: ImageRow[] = [
    { imageUrl: '', displayOrder: 1, previewError: false }
  ];

  categories = [
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

  stores = [
    { id: 1, name: 'Main Store' },
    { id: 2, name: 'Branch - North' },
    { id: 3, name: 'Branch - South' },
    { id: 4, name: 'Online Store' },
    { id: 5, name: 'Warehouse' },
  ];

  addInventory(): void {
    this.inventories.push({ storeId: null, stockQty: 0 });
  }

  removeInventory(index: number): void {
    if (this.inventories.length > 1) {
      this.inventories.splice(index, 1);
    }
  }

  addImage(): void {
    this.images.push({
      imageUrl: '',
      displayOrder: this.images.length + 1,
      previewError: false
    });
  }

  removeImage(index: number): void {
    if (this.images.length > 1) {
      this.images.splice(index, 1);
      this.images.forEach((img, i) => (img.displayOrder = i + 1));
    }
  }

  onImageError(img: ImageRow): void {
    img.previewError = true;
  }

  onImageUrlChange(img: ImageRow): void {
    img.previewError = false;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

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
      this.errorMessage = 'Discount price must be less than or equal to the price.';
      return;
    }

    const payload = {
      productName:   this.productName.trim(),
      categoryId:    this.categoryId,
      brand:         this.brand.trim()         || null,
      description:   this.description.trim()   || null,
      sku:           this.sku.trim()            || null,
      price:         this.price,
      discountPrice: this.discountPrice         ?? null,
      weight:        this.weight               ?? null,
      isFeatured:    this.isFeatured,
      inventories:   this.inventories
                       .filter(inv => inv.storeId !== null)
                       .map(inv => ({ storeId: inv.storeId!, stockQty: inv.stockQty })),
      images:        this.images
                       .filter(img => img.imageUrl.trim())
                       .map(img => ({ imageUrl: img.imageUrl.trim(), displayOrder: img.displayOrder }))
    };

    this.isSubmitting = true;

    this.productSvc.createProduct(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting   = false;
        this.successMessage = `Product "${this.productName}" created successfully! (ID: ${res.productId})`;
        setTimeout(() => this.router.navigate(['/dashboard']), 2500);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create product. Please check your connection and try again.';
      }
    });
  }
}
