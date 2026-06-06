import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProduct(dto: {
    productName:   string;
    categoryId:    number;
    brand?:        string | null;
    description?:  string | null;
    sku?:          string | null;
    price:         number;
    discountPrice?: number | null;
    weight?:       number | null;
    isFeatured:    boolean;
    inventories:   { storeId: number; stockQty: number }[];
    images:        { imageUrl: string; displayOrder: number }[];
  }): Observable<{ success: boolean; message: string; productId: number }> {
    return this.http.post<{ success: boolean; message: string; productId: number }>(
      this.apiUrl, dto
    );
  }

  updateProduct(id: number, dto: {
    productName:   string;
    categoryId:    number | null;
    brand?:        string | null;
    description?:  string | null;
    sku?:          string | null;
    price:         number;
    discountPrice?: number | null;
    weight?:       number | null;
    isFeatured?:   boolean;
    isActive?:     boolean;
    imageUrl?:     string | null;
  }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
