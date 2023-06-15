import { Component } from "@angular/core";
import { ProductService } from "../services/product-service";
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "../services/local-storage.service";
import { Product } from "../models/product.model";
import { Observable } from "rxjs";

@Component({
  selector: 'shopping-cart',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  currentProduct?: Observable<Product>;
  shoppingCartCount = 0;
  quantity = 1;
  htmlProduct: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentProduct = this.productService.getProductById(params['id']) as Observable<Product>;

      this.currentProduct.subscribe((val: any) => {
        this.htmlProduct = val;
      });
    });

    this.shoppingCartCount = this.localStorageService.getShoppingCartCount();
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity === 1) {
      return;
    }
    this.quantity--;
  }

  addToShoppingCart(): void {
    this.currentProduct?.subscribe((val: Product) => {
      this.localStorageService.addToShoppingCart({
        id: val.id,
        name: val.name,
        price: val.price,
        quantity: this.quantity,
        base64Photo: val.photoBase64,
        totalPrice: val.price,
        priceForOne: val.price * this.quantity,
      });

      this.shoppingCartCount = this.localStorageService.getShoppingCartCount();
    })
  }
}
