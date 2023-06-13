import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders();

  ngOnInit() {
    this.headers = this.headers.set('content-type', 'charset=UTF-8');
  }

  getAllProducts(from: number, count:number, producerId = '0', name = '0') {
    return this.http.get<Product>(
      `https://localhost:7251/api/Product/GetAllProducts/${from}/${count}/${producerId}/${name}`,
      {headers: this.headers}
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
