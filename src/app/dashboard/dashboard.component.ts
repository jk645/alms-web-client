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

    this.courses = [
      {name: 'Intensive Thinking Strategically in the Digital Age (MGMTMBA 200)'},
      {name: 'Merage Consulting Projects (MGMTMBA 298)'},
      {name: 'New Venture Management (MGMTMBA 213)'},
      {name: 'Organizational Leadership for Management (MGMTMBA 202)'},
      {name: 'Business Law (MGMTMBA 292)'},
    ];
  }

}
