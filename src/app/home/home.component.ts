import { Component } from '@angular/core';
import { ProductService } from '../services/product-service';
import { ProducerService } from '../services/producer-service'
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  products$: any;
  producers$: any;
  currentPage = 1;
  showProductCount = 9;
  productCount$: any;
  maxPages = 0;
  paginationValues: number[] = [];
  currentProducers: string[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private producerService: ProducerService
  ) {}

  ngOnInit(): void {
    this.loadAllProduct(this.currentPage - 1, this.showProductCount);
    this.loadAllProducers();

    this.route.params.subscribe((params) => {
      this.currentPage = +params['id']; // (+) converts string 'id' to a number
      this.changePage(this.currentPage);
    });
  }

  addDecimalToPrice(array: any): any {
    for (let i = 0; i < array.length; i++) {
      array[i].price += 0.00001;
    }

    return array;
  }

  loadAllProduct(from: number, count: number) {
    this.products$ = this.productService.getAllProducts(
      this.currentPage - 1,
      this.showProductCount
    );

    this.productCount$ = this.productService
      .getProductCount()
      .subscribe((val) => {
        this.calculatePagination(+val);
      });

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

  setProducer(producer: any) {
    console.log("producer - " + producer)
    this.currentProducers.push(producer);
  }

  removeProducer(producer: string) {
    this.currentProducers.slice(this.currentProducers.indexOf(producer), 1);
  }
}
