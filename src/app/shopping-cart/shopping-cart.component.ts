import { Component } from '@angular/core';
import { ShoppingCartModel } from '../models/shopping-cart.model';
import { CouponModel } from '../models/coupon-model';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
})
export class ShoppingCartComponent {
  purchases: any;
  totalPriceForAllPurchase = 0;
  shippingPrice = 70;

  constructor() {
  }

  ngOnInit() {
    this.purchases = localStorage.getItem('shoppingCart');
    if (this.purchases != null) {
      this.purchases = JSON.parse(this.purchases);
      console.log(this.purchases);
    }

    this.calculateTotalPrice()
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
    let purchase = (this.purchases as ShoppingCartModel[]).find((x) => x.id == purchaseId);
    if (!purchase) {
      return;
    }

    if(purchase.quantity <= 0) {
      return;
    }

    purchase.quantity--;
    purchase.totalPrice -= purchase.priceForOne;
    this.purchases[this.purchases.find((x: any) => x.id == purchaseId)] = purchase;

    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPriceForAllPurchase = 0;

    (this.purchases as ShoppingCartModel[]).forEach(x => {
      this.totalPriceForAllPurchase += x.totalPrice
    });

    if(this.totalPriceForAllPurchase <= 1) {
      return
    }
    this.totalPriceForAllPurchase += this.shippingPrice;
  }

  removePurchase(purchaseId: string) {
    this.purchases = this.purchases.filter(function (item: ShoppingCartModel) {
      return item.id !== purchaseId;
    });

    localStorage.setItem('shoppingCart', JSON.stringify(this.purchases));
    this.calculateTotalPrice();
  }

  enterCoupon(coupon: string) {

  }
}
