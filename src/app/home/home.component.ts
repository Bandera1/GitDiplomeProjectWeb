import { Component } from '@angular/core';
import { ProductService } from '../services/product-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private productService: ProductService) {
    let products = productService.getAllProducts();
    console.log(products);
  }
}
