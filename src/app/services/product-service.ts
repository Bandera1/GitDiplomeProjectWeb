import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getAllProducts(from: number, count:number) {
    return this.http.get<Product>(
      `https://localhost:7251/api/Product/GetAllProducts/${from}/${count}`
    );
  }

  getProductById(id: string) {
    return this.http.get(
      `https://localhost:7251/api/Product/GetProductById/${id}`
    );
  }

  getProductCount() {
    return this.http.get(
      'https://localhost:7251/api/Product/GetProductsCounts'
    );
  }
}
