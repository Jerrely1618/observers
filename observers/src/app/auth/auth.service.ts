import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthServicesComponent {
  private auth0Client?: Auth0Client;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private errors: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:3000/api';
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuth0();
    }
  }
  private async initializeAuth0() {
    this.auth0Client = new Auth0Client({
      domain: 'dev-jx5b0ki2qctj8hxd.us.auth0.com',
      clientId: '1h4ucTDXA9vVDd2A0oAAMObRaqLqa8vV',
      authorizationParams: {
        redirect_uri: 'https://localhost:4200/callback',
        audience: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/api/v2/'
      },
      cacheLocation: 'localstorage',
    });

    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.loggedIn.next(isAuthenticated);
    if (isAuthenticated) {
        this.router.navigate(['/user']);
    }
  }
  public getUser(): Observable<any> {
    const itemJSON = localStorage.getItem('access_token');
    if (!itemJSON) {
      console.error('No token found in localStorage');
      return throwError(() => new Error('No token found'));
    }
  
    let item;
    try {
      item = JSON.parse(itemJSON);
    } catch (e) {
      console.error('Failed to parse token', e);
      return throwError(() => new Error('Failed to parse token'));
    }
  
    if (!item || new Date().getTime() > item.expiry) {
      localStorage.removeItem('access_token');
      console.error('Token has expired');
      return throwError(() => new Error('Token has expired'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${item.value}`
    });
  
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }
  
  public async handleAuthentication(): Promise<void> {
    if (!this.auth0Client) {
      console.error('Auth0Client is not initialized.');
      this.router.navigate(['/error'], { queryParams: { error: 'client_not_initialized' } });
      return;
    }
  
    try {
      const result = await this.auth0Client.handleRedirectCallback();
      const isAuthenticated = await this.auth0Client.isAuthenticated();
      this.loggedIn.next(isAuthenticated);
      if (isAuthenticated) {
        const appState = result.appState || {};
        if (appState.intent === 'signup') {
          const user = await this.auth0Client.getUser();
          if (user) {
            this.createUserInDatabase(user);
          }
        }
        this.router.navigate([appState.targetUrl || '/user']);
      } else {
        this.router.navigate(['/'], { queryParams: { error: 'authentication_failed' } });
      }
    } catch (error: any) {
      console.error('Error processing authentication:', error);
      this.errors.next(error);
      this.router.navigate(['/error'], { queryParams: { error: 'authentication_exception', details: error.message || 'Unknown error' } });
    }
  }
  
  

  private createUserInDatabase(user: any): void {
    console.log('Creating user in database:', user);
    this.auth0Client?.getTokenSilently().then((token: string) => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      const userData = {
        email: user.email,
        username: user.nickname || 'defaultUsername'
      };
      this.http.post(`${this.apiUrl}/signup`, userData, { headers }).subscribe({
        next: (response) => console.log('User created in database:', response),
        error: (err) => console.error('Error creating user in database:', err)
      });
    }).catch((error: any) => {
      console.error('Error retrieving access token:', error);
    });
  }

  public login(): void {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) return;
    this.auth0Client.loginWithRedirect().then(() => {
      this.auth0Client?.getTokenSilently().then(token => {
        const now = new Date();
        console.log(token)
        const item = {
          value: token,
          expiry: now.getTime() + 3600000,
        };
        localStorage.setItem('access_token', JSON.stringify(item));
        console.log('Token stored with expiry:', item);
      }).catch(err => {
        console.error('Error retrieving token', err);
      });
    });
  }
  

  public async signup(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) {
      console.error('Environment not suitable for Auth0 or Auth0Client not initialized.');
      return;
    }

    this.auth0Client.loginWithRedirect({
      appState: {
        target: '/user',
        intent: 'signup'
      },
      authorizationParams: {
        screen_hint: 'signup'
      }
    });
  }

  public logout(): void {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) return;
    this.auth0Client.logout();
    this.loggedIn.next(false);
  }


  public isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  public isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }
  public getErrors(): Observable<any> {
    return this.errors.asObservable();
  }
}
