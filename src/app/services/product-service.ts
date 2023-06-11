import { HttpClient } from "@angular/common/http";

export class ProductService {
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<any>(
      'https://localhost:7251/api/Product/GetAllProducts'
    );
  }
}
