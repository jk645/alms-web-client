import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { LoginService } from '../login-service/login.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate() {
    const userIsLoggedIn = !!this.loginService.getAuthToken();
    const hashRoute = window.location.hash.substring(1);

    if (hashRoute && hashRoute !== '/' && hashRoute !== '/login') {
      this.loginService.nextRoute = hashRoute;
    }

    if (!userIsLoggedIn) {
      this.router.navigate(['/login']);
    }

    return userIsLoggedIn;
  }

}
