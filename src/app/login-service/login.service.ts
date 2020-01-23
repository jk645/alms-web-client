import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, EMPTY } from 'rxjs';
import * as jwtDecode from 'jwt-decode';

import { LoginCredentials, ShareCodeCredentials, TokenContainer } from './auth';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  environment = environment;
  resourceUrl = '/auth';

  refreshInProgress: boolean = false;
  private _nextRoute: string;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Prepend correct API Url prefix according to environment
    this.resourceUrl = this.environment.apiUrl + this.resourceUrl;
  }

  get defaultPartnerId(): string {
    return localStorage.getItem('defaultPartnerId');
  }
  set defaultPartnerId(newValue: string) {
    localStorage.setItem('defaultPartnerId', newValue);
  }
  clearDefaultPartnerId(): void {
    localStorage.removeItem('defaultPartnerId');
  }

  get nextRoute(): string {
    return this._nextRoute;
  }
  set nextRoute(newValue: string) {
    this._nextRoute = newValue;
  }

  get shareCodeCredentials(): ShareCodeCredentials {
    return JSON.parse(sessionStorage.getItem('shareCodeCredentials') || null);
  }
  set shareCodeCredentials(newValue: ShareCodeCredentials) {
    sessionStorage.setItem('shareCodeCredentials', JSON.stringify(newValue));
  }
  clearShareCodeCredentials(): void {
    localStorage.removeItem('shareCodeCredentials');
  }

  getAuthenticated(credentials: LoginCredentials): Observable<TokenContainer> {
    return Observable.create((observer) => {
      this.http.post<TokenContainer>(this.resourceUrl, credentials)
        .subscribe(
          (tokenContainer: TokenContainer) => {
            this.clearDefaultPartnerId();  // If logged on, proves an account has already been created, thus no need to keep storing 'defaultPartnerId'
            sessionStorage.setItem('tokenContainer', JSON.stringify(tokenContainer));
            observer.next(tokenContainer);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  getAuthViaShareCode(credentials: ShareCodeCredentials): Observable<TokenContainer> {
    const specificPath = '/share-code';

    return Observable.create((observer) => {
      this.http.post<TokenContainer>(this.resourceUrl + specificPath, credentials)
        .subscribe(
          (tokenContainer: TokenContainer) => {
            this.clearDefaultPartnerId();  // If logged on, proves an account has already been created, thus no need to keep storing 'defaultPartnerId'
            sessionStorage.setItem('tokenContainer', JSON.stringify(tokenContainer));
            observer.next(tokenContainer);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  joinOrgViaShareCode(credentials: ShareCodeCredentials): Observable<TokenContainer> {
    const specificPath = '/join-org';

    return Observable.create((observer) => {
      this.http.post<TokenContainer>(this.resourceUrl + specificPath, credentials)
        .subscribe(
          (tokenContainer: TokenContainer) => {
            sessionStorage.setItem('tokenContainer', JSON.stringify(tokenContainer));
            observer.next(tokenContainer);
          },
          (error) => {
            observer.error(error);
          }
        );
    });
  }

  refreshTokensAndUser(): Observable<TokenContainer> {
    // Guard so that only one refresh can be in progress at a time,
    // because multiple failed requests could trigger this at once
    if (this.refreshInProgress) {
      return EMPTY;
    }
    this.refreshInProgress = true;

    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}` // Use refreshToken
    });

    return Observable.create((observer) => {
      this.http.get<TokenContainer>(this.resourceUrl, {headers: headers})
        .subscribe(
          (tokenContainer: TokenContainer) => {
            sessionStorage.setItem('tokenContainer', JSON.stringify(tokenContainer));
            this.refreshInProgress = false;
            observer.next(tokenContainer);
          },
          (error) => {
            this.logOut(); // Maybe refresh token is expired, take user to login page
            this.refreshInProgress = false;
            observer.error(error);
          }
        );
    });
  }

  logOut(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.nextRoute = '';
    this.router.navigate(['/login']);
  }

  getAuthToken(): any {
    var tokenContainer = JSON.parse(sessionStorage.getItem('tokenContainer'));

    if (!tokenContainer) {
      return;
    }
    else {
      return tokenContainer.token;
    }
  }

  getRefreshToken(): any {
    const tokenContainer = JSON.parse(sessionStorage.getItem('tokenContainer'));

    if (!tokenContainer) {
      return;
    }
    else {
      return tokenContainer.refreshToken;
    }
  }

  getUser(): User {
    var tokenContainer = JSON.parse(sessionStorage.getItem('tokenContainer'));

    if (!tokenContainer) {
      return;
    }
    else {
      return tokenContainer.user;
    }
  }

}
