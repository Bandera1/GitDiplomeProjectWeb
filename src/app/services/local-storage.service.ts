import { Injectable } from '@angular/core';
import { ShoppingCartModel } from '../models/shopping-cart.model';
import { Product } from '../models/product.model';

const SHOPPING_CART_KEY = 'shoppingCart';
const SHOPPING_CART_COUNT = 'shoppingCartCount';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  shoppingCart: ShoppingCartModel[] = [];

  constructor() {}

  ngOnInit() {
    this.updateLocalCache();
  }

  getFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  addToShoppingCart(model: Product): void {
    let checkProduct = this.shoppingCart.filter((x: ShoppingCartModel) => {
      return x['id'] === model.id;
    });

    if (checkProduct.length !== 0) {
      // IF PRODUCT ALREADY IN SHOPPING CART
      this.shoppingCart.forEach((element: ShoppingCartModel) => {
        if (element.id === model.id) {
          element.quantity++;
          element.totalPrice = element.quantity * element.price;
        }
      });

      localStorage.setItem(
        SHOPPING_CART_KEY,
        JSON.stringify(this.shoppingCart)
      );

      this.updateLocalCache();
      return;
    }

    let jsonData: ShoppingCartModel = {
      id: model.id,
      name: model.name,
      price: model.price,
      quantity: 1,
      base64Photo: model.photoBase64,
      totalPrice: Math.floor(model.price),
      priceForOne: Math.floor(model.price),
    };

    this.shoppingCart.push(jsonData);
    localStorage.setItem(
      SHOPPING_CART_COUNT,
      (this.getShoppingCartCount() + 1).toString()
    );
    localStorage.setItem(SHOPPING_CART_KEY, JSON.stringify(this.shoppingCart));

    this.updateLocalCache();
  }

  getShoppingCart(): ShoppingCartModel[] {
    let purchases = localStorage.getItem(SHOPPING_CART_KEY);

    if (purchases != null) {
      let result = JSON.parse(purchases) as ShoppingCartModel[];
      return result;
    }

    return [];
  }

  removeFromShoppingCart(model: Product): ShoppingCartModel[] {
    this.shoppingCart = this.shoppingCart.filter(function (item: ShoppingCartModel) {
      return item.id !== model.id;
    });

    localStorage.setItem(
      SHOPPING_CART_KEY,
      JSON.stringify(this.shoppingCart)
    );
    this.updateLocalCache();

    return this.shoppingCart;
  }

  getShoppingCartCount(): number {
    console.log(Number(localStorage.getItem(SHOPPING_CART_COUNT)));
    return Number(localStorage.getItem(SHOPPING_CART_COUNT));
  }

  updateLocalCache() {
    this.shoppingCart = this.getShoppingCart();
  }
}
