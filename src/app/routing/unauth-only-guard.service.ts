import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LoginService } from '../login-service/login.service';

@Injectable()
export class UnauthOnlyGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate() {
    const userIsNotLoggedIn = !this.loginService.getAuthToken();
    return userIsNotLoggedIn;
  }

}
