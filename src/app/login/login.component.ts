import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as _ from "lodash";

import { LoginService } from '../login-service/login.service';
import { LoginCredentials } from '../login-service/auth';
import { User } from '../login-service/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faSpinner = faSpinner;

  // Form
  form: FormGroup;
  formSubmitAttempted: boolean = false;

  sendingData: boolean = false;
  sendingDataError: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(): void {
    this.form = this.formBuilder.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, Validators.required]
    });
  }

  resetForm(): void {
    this.formSubmitAttempted = false;
    this.form.reset();
  }

  submit(): void {
    this.formSubmitAttempted = true;

    if (this.form.status === 'INVALID') {
      return;
    }

    const credentials = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    };

    this.getAuthenticated(credentials);
  }

  startOver(): void {
    this.resetForm();
  }

  getAuthenticated(credentials: LoginCredentials): void {
    if (this.sendingData) {
      return;
    }
    this.sendingData = true;
    this.sendingDataError = null;

    this.loginService.getAuthenticated(credentials)
      .subscribe(
        (result) => {
          this.sendingData = false;
          const nextRoute = this.loginService.nextRoute;
          this.loginService.nextRoute = '';
          if (nextRoute) {
            this.router.navigateByUrl(nextRoute);
          }
          else {
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.sendingData = false;
          this.sendingDataError = _.get(error, 'error.message', 'Unknown error');
          console.error(error);
        }
      );
  }

}
