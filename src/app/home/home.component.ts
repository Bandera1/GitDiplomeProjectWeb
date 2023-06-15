import { Component } from '@angular/core';
import { ProductService } from '../services/product-service';
import { ProducerService } from '../services/producer-service';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { ShoppingCartModel } from '../models/shopping-cart.model'
import { LocalStorageService } from '../services/local-storage.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  products$: any;
  producers$: any;
  categories$: any;
  currentPage = 1;
  showProductCount = 9;
  productCount$: any;
  maxPages = 0;
  paginationValues: number[] = [];
  currentProducers: string[] = [];
  isCategoryDropdownShow = false;
  currentCategory = '';
  currentProducerId = '';
  shoppingCartCount = 0;
  shoppingCard: ShoppingCartModel[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private producerService: ProducerService,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadAllProduct(this.currentPage - 1, this.showProductCount);
    this.loadAllProducers();
    this.loadAllCategories();

    this.route.params.subscribe((params) => {
      this.currentPage = +params['page']; // (+) converts string 'id' to a number
      this.changePage(this.currentPage);
    });

    this.productCount$ = this.productService.getProductCount();
    this.shoppingCartCount = this.localStorageService.getShoppingCartCount();
  }

  addDecimalToPrice(array: any): any {
    for (let i = 0; i < array.length; i++) {
      array[i].price += 0.00001;
    }

    return array;
  }

  loadAllProduct(
    from: number,
    count: number,
    categoryId = '0',
    name = '0',
    producer = '0'
  ) {
    this.paginationValues = []; //  clear previous pagination

    this.products$ = this.productService.getAllProducts(
      this.currentPage - 1,
      this.showProductCount,
      categoryId,
      name,
      producer
    );

    this.calculatePagination(+this.productCount$);
    this.products$ = this.products$.pipe(
      map((val: any) => {
        return this.addDecimalToPrice(val);
      })
    );
  }

  calculatePagination(productCount: number) {
    this.maxPages = Math.ceil(+(productCount / this.showProductCount));
    let startPosition = this.currentPage - 1;

    if (this.currentPage === 1 || this.currentPage === 2) {
      startPosition = 1;
    } else if (this.maxPages - this.currentPage === 0) {
      startPosition -= 1;
    }

    for (let i = startPosition - 1; i < startPosition + 2; i++) {
      this.paginationValues.push(i + 1);
    }

    console.log('Pagination - ' + this.paginationValues);
  }

  changePage(page: number) {
    if (page > this.maxPages) {
      return;
    }

    this.paginationValues = []; //  clear previous pagination
    this.currentPage = page;
    this.loadAllProduct(
      (page - 1) * this.showProductCount,
      this.showProductCount
    );
  }

  loadAllProducers() {
    this.producers$ = this.producerService.getAllProducers();
  }

  setProducer(producerId: any) {
    if (producerId === this.currentProducerId) {
      producerId = '0';
    }
    this.currentProducerId = producerId;

    this.loadAllProduct(
      this.currentPage - 1,
      this.showProductCount,
      '0',
      '0',
      producerId
    );
  }

  searchByNameHandler(eventTarget: any) {
    if (!eventTarget.value) {
      this.loadAllProduct(this.currentPage - 1, this.showProductCount);
      return;
    }

    this.loadAllProduct(
      this.currentPage - 1,
      this.showProductCount,
      '0',
      eventTarget.value
    );
  }

  toogleCategoryDropdown() {
    this.isCategoryDropdownShow = !this.isCategoryDropdownShow;
  }

  loadAllCategories() {
    this.categories$ = this.categoryService.getAllCategories();
  }

  setCategoryFilter(category: string) {
    this.loadAllProduct(this.currentPage - 1, this.showProductCount, category);
  }

  addProductToShoppingCart(product: Product) {
    this.localStorageService.addToShoppingCart({
      id: product.id,
      base64Photo: product.photoBase64,
      name: product.name,
      price: product.price,
      priceForOne: product.price,
      quantity: 1,
      totalPrice: product.price
    });
    this.shoppingCartCount = this.localStorageService.getShoppingCartCount();
  }
}
