import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { CourseService } from '../course-service/course.service';
import { Course } from '../course-service/course';
import { Page } from '../utilities/page';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  faSpinner = faSpinner;
  fetchingCourses: boolean = false;
  fetchingCoursesError: any = null;

  courses: Course[] = null;

  constructor(
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.findCourses();
  }

  findCourses() {
    if (this.fetchingCourses) {
      return;
    }
    this.fetchingCourses = true;
    this.fetchingCoursesError = null;

    this.courseService.findCourses()
      .subscribe(
        (coursesPage: Page<Course>) => {
          this.fetchingCourses = false;
          this.courses = coursesPage.data;
        },
        (error) => {
          this.fetchingCourses = false;
          this.fetchingCoursesError = error;
          console.log(error);
        }
      );
  }

}
