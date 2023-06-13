import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get<Product>(
      `https://localhost:7251/api/Category/GetAllCategories`
    );
  }
}
