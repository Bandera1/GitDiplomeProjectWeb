import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ProductService } from './services/product-service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProducerService } from './services/producer-service';
import { CategoryService } from './services/category-service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LocalStorageService } from './services/local-storage.service';
@NgModule({
  declarations: [AppComponent, HomeComponent, ShoppingCartComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'home/:id', component: HomeComponent, pathMatch: 'full' },
      { path: 'cart', component: ShoppingCartComponent },
      { path: '**', redirectTo: '/home/1' },
    ]),
  ],
  providers: [
    ProductService,
    ProducerService,
    CategoryService,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
