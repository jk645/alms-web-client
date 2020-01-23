import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { CONFIG } from '../config';
import * as _ from 'lodash';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Some URLs don't require auth, proceed with request unchanged
    const whitelist = _.map(CONFIG.noAuthInterceptorEndpoints, (ep) => {
      return {
        url: `${environment.apiUrl}/${ep.url}`, // Add origin to URL
        method: ep.method
      }
    });
    const matchingEndpoint = _.find(whitelist, {url: req.url, method: req.method});
    if (matchingEndpoint) {
      return next.handle(req);
    }

    const headers = {};

    const authToken = this.loginService.getAuthToken();
    if (!authToken) {
      return throwError('Authorization token not found. Unable to send request to server.');
    }
    headers['Authorization'] = `Bearer ${authToken}`;

    const shareCodeCredentials = this.loginService.shareCodeCredentials;
    if (shareCodeCredentials) {
      headers['actus-share-code-credentials'] = btoa(JSON.stringify(shareCodeCredentials));
    }

    const transformedReq = req.clone({
      setHeaders: headers
    });
    return next.handle(transformedReq);
    // Want to retry requests with some delay, and trigger request to refresh token, but only trigger it once, rate limit or guard it till its complete somehow
    // If 401 error, want to trigger the refresh token process.  Not sure if should do it in here or pipe within each service.
  }
}
