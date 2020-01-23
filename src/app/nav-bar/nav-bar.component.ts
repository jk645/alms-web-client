import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { faCog, faUser } from '@fortawesome/free-solid-svg-icons';

import { CONFIG } from '../config';
import { LoginService } from '../login-service/login.service';
import { User } from '../login-service/user';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  faCog = faCog;
  faUser = faUser;
  isCollapsed: boolean = true;
  user: User = null;
  testingStageLabel: string = CONFIG.testingStageLabel;

  constructor(
    private router: Router,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.user = this.loginService.getUser();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isCollapsed = true;
      }
    });
  }

  logOut(): void {
    this.loginService.logOut();
  }

}
