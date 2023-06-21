import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ProductService } from './services/product-service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProducerService } from './services/producer-service';
import { CategoryService } from './services/category-service';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LocalStorageService } from './services/local-storage.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginComponent } from './login/login-component';
import { AuthService } from './services/auth-service';
import { TokenInterceptor } from './utils/token-interceptor';
import { AdminComponent } from './admin-page/admin-page.component';
import { AdminGuard } from './utils/admin.guard';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShoppingCartComponent,
    ProductDetailComponent,
    LoginComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'home/:page', component: HomeComponent, pathMatch: 'full' },
      { path: 'detail/:id', component: ProductDetailComponent },
      { path: 'cart', component: ShoppingCartComponent },
      { path: 'login', component: LoginComponent },
      { path: 'admin', component: AdminComponent, canActivate:[AdminGuard] },
      { path: '**', redirectTo: '/home/1' },
    ]),
  ],
  providers: [
    ProductService,
    ProducerService,
    CategoryService,
    LocalStorageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
