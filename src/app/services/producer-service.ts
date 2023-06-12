import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProducerService {
  constructor(private http: HttpClient) {}

  getAllProducers() {
    return this.http.get<Product>(`https://localhost:7251/api/Producer/GetAllProducers`);
  }
}
