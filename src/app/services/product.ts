import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl = 'https://localhost:7075/api/Products';

  constructor(private http: HttpClient) { }

  getProducts()
  {
    return this.http.get(this.apiUrl);
  }
}