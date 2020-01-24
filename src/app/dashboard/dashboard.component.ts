import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { LoginService } from '../login-service/login.service';
import { User } from '../login-service/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  faSpinner = faSpinner;
  fetchingCourses: boolean = false;
  fetchingCoursesError: any = null;

  user: User = null;
  courses: any[] = null;

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.user = this.loginService.getUser();
    this.refreshData();
  }

  refreshData() {
    if (this.fetchingCourses) {
      return;
    }
    this.fetchingCourses = true;
    this.fetchingCoursesError = null;

    this.courses = [];
  }

}
