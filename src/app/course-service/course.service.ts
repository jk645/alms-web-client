import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import * as _ from "lodash";

import { HttpRequestPipesService } from '../utilities/http-request-pipes.service';
import { Course, CourseQuery } from './course';
import { Page } from '../utilities/page';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  environment = environment;
  resourceUrl = '/courses';

  constructor(
    private http: HttpClient,
    private httpRequestPipesService: HttpRequestPipesService
  ) {
    // Prepend correct API Url prefix according to environment
    this.resourceUrl = this.environment.apiUrl + this.resourceUrl;
  }

  getCourse(id: string): Observable<Course> {
    const specificPath = '/' + id;

    return this.http.get<Course>(this.resourceUrl + specificPath).pipe(
      this.httpRequestPipesService.refreshTokensAndUser<Course>(),
      this.httpRequestPipesService.retryRequest<Course>()
    );
  }

  findCourses(query?: CourseQuery): Observable<Page<Course>> {
    let params = {};

    if (query) {
      query = _.mergeWith({}, query, (objValue, srcValue) => {
        return String(srcValue); // Change all values to String as required by HttpParams
      });
      params = new HttpParams({fromObject: query as any});
    }

    return this.http.get<Page<Course>>(this.resourceUrl, {
      params: params
    }).pipe(
      this.httpRequestPipesService.refreshTokensAndUser<Page<Course>>(),
      this.httpRequestPipesService.retryRequest<Page<Course>>()
    );
  }

}
