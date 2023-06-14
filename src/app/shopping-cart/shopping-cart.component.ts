import { Component } from '@angular/core';
import { ShoppingCartModel } from '../models/shopping-cart.model';
import { LocalStorageService } from '../services/local-storage.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent {
  purchases: any;
  totalPriceForAllPurchase = 0;
  shippingPrice = 70;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.purchases = this.localStorageService.getShoppingCart();
    this.calculateTotalPrice();
  }

  increaseQuantity(purchaseId: string) {
    let purchase = (this.purchases as ShoppingCartModel[]).find(
      (x) => x.id == purchaseId
    );
    if (!purchase) {
      return;
    }

    purchase.quantity++;
    purchase.totalPrice += purchase.priceForOne;
    this.purchases[this.purchases.find((x: any) => x.id == purchaseId)] =
      purchase;

    this.calculateTotalPrice();
  }

  decreaseQuantity(purchaseId: string) {
    let purchase = (this.purchases as ShoppingCartModel[]).find(
      (x) => x.id == purchaseId
    );
    if (!purchase) {
      return;
    }

    if (purchase.quantity <= 0) {
      return;
    }

    purchase.quantity--;
    purchase.totalPrice -= purchase.priceForOne;
    this.purchases[this.purchases.find((x: any) => x.id == purchaseId)] =
      purchase;

    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPriceForAllPurchase = 0;

    (this.purchases as ShoppingCartModel[]).forEach((x) => {
      this.totalPriceForAllPurchase += x.totalPrice;
    });

    if (this.totalPriceForAllPurchase <= 1) {
      return;
    }
    this.totalPriceForAllPurchase += this.shippingPrice;
  }

  removePurchase(purchase: Product) {
    this.purchases = this.localStorageService.removeFromShoppingCart(purchase);
    this.calculateTotalPrice();
  }
}
