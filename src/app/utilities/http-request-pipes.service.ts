import { Injectable } from '@angular/core';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, retryWhen, delay, map } from 'rxjs/operators';

import { CONFIG } from '../config';
import { LoginService } from '../login-service/login.service';


@Injectable({
  providedIn: 'root'
})
export class HttpRequestPipesService {

  constructor(
    private loginService: LoginService
  ) { }

  refreshTokensAndUser<T>() {
    return catchError<T, any>(
      (error: any, caught: Observable<T>): any => {
        if (error.status === 401) {
          this.loginService.refreshTokensAndUser().subscribe();
        }
        return throwError(error);
      }
    );
  }

  retryRequest<T>() {
    return retryWhen<T>(
      (errors: Observable<any>): Observable<any> => {
        let retries = 0;
        return errors.pipe(delay(CONFIG.httpRequestRetryWaitMs), map(
          (error: any): any => {
            // If not specific status code, don't retry
            if (CONFIG.httpRequestRetryOnCodes.indexOf(error.status) === -1) {
              throw error;
            }
            if (retries++ === CONFIG.httpRequestRetries) {
              throw error;
            }
            return error;
          }, 0)
        );
      }
    );
  }

}
