import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { LoginUser } from "../models/login-user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: any;

  constructor(private http: HttpClient) {}

  login(user: LoginUser): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      'https://localhost:7251/api/Account/LoginUser',
      user
    ).pipe(
      tap(({token}) => {
        localStorage.setItem('auth-token', token);
      })
    );
  }

  setToken(token: any):void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }
}
