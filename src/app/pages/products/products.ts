import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService)
  {

  }

  ngOnInit(): void {

    this.productService.getProducts()
      .subscribe((res: any) => {

        this.products = res;

      });
  }
}