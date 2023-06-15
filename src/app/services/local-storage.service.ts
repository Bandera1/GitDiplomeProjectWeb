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

  addToShoppingCart(model: ShoppingCartModel): void {
    this.updateLocalCache();

    let checkProduct = this.shoppingCart.find((x: ShoppingCartModel) => {
      return x.id === model.id;
    });

    if (checkProduct) { // IF PRODUCT ALREADY IN SHOPPING CART
      return;
    }

    let jsonData: ShoppingCartModel = {
      ...model,
      totalPrice: Math.floor(model.price),
      priceForOne: Math.floor(model.price),
    };

    this.shoppingCart.push(jsonData);
    localStorage.setItem(
      SHOPPING_CART_KEY,
      JSON.stringify(this.shoppingCart)
    );
    localStorage.setItem(
      SHOPPING_CART_COUNT,
      (this.getShoppingCartCount() + 1).toString()
    );

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
    this.shoppingCart = this.shoppingCart.filter((item: ShoppingCartModel) => {
      return item.id !== model.id;
    });

    localStorage.setItem( SHOPPING_CART_KEY, JSON.stringify(this.shoppingCart));
    localStorage.setItem(SHOPPING_CART_COUNT, (this.getShoppingCartCount() - 1).toString());

    this.updateLocalCache();

    return this.shoppingCart;
  }

  getShoppingCartCount(): number {
    return Number(localStorage.getItem(SHOPPING_CART_COUNT));
  }

  updateLocalCache() {
    this.shoppingCart = this.getShoppingCart();
  }
}
