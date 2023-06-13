import { Component } from '@angular/core';
import { ProductService } from '../services/product-service';
import { ProducerService } from '../services/producer-service';
import { find, map, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category-service';

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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private producerService: ProducerService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadAllProduct(this.currentPage - 1, this.showProductCount);
    this.loadAllProducers();
    this.loadAllCategories();

    this.route.params.subscribe((params) => {
      this.currentPage = +params['id']; // (+) converts string 'id' to a number
      this.changePage(this.currentPage);
    });

    this.productCount$ = this.productService.getProductCount();

    localStorage.setItem('shoppingCartCount', this.shoppingCartCount.toString());
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

  // removeProducer(producer: string) {
  //   this.currentProducers = this.currentProducers.slice(this.currentProducers.indexOf(producer), 1);
  //   console.log("Remove producer: " + producer);
  // }

  searchByNameHandler(eventTarget: any) {
    if (!eventTarget.value) {
      this.loadAllProduct(this.currentPage - 1, this.showProductCount);
      return;
    }

    console.log('Search -' + eventTarget.value);

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

  addProductToShoppingCart(productId: string) {
    let selectedProduct;
    this.products$.subscribe((value: any[]) => {
      selectedProduct = value.find((x) => x.id === productId);
      let jsonData = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
        base64Photo: selectedProduct.PhotoBase64
      };

      localStorage.setItem('shoppingCartCount', (this.shoppingCartCount++).toString());
    });
  }
}
