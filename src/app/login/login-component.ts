import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth-service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'login-component',
  templateUrl: './login-component.html',
  styleUrls: [
    './utils/scss/style.scss',
  ],
})
export class LoginComponent {
  form: FormGroup;
  aSab: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) {
    this.form = new FormGroup( {
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

  }

  onSubmit() {
    this.aSab = this.authService.login(this.form.value).subscribe((token) => {
      console.log('Login succesed, token - ', token)
      this.router.navigate(['/admin/']);
    });
  }

  ngOnDestroy() {
    if(this.aSab) {
      this.aSab.unsubscribe();
    }
  }
}
