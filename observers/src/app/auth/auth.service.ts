import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Observable, catchError, from, of, switchMap, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { profile } from 'node:console';
@Injectable({
  providedIn: 'root'
})
export class AuthServicesComponent {
  private auth0Client?: Auth0Client;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private errors: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private apiUrl = 'http://localhost:3000/api';
  private userSource = new BehaviorSubject<any | null>(null);
  user$ = this.userSource.asObservable();
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
        audience: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/api/v2/',
        scope: 'openid profile email read:users'
      },
      
      cacheLocation: 'memory',
    });

    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.loggedIn.next(isAuthenticated);
    if (isAuthenticated) {
        this.router.navigate(['/user']);
    }
  }
  
  public getUser(): Observable<any> {
    if (!this.auth0Client) {
      console.error('Auth0Client is not initialized.');
      this.router.navigate(['/error'], { queryParams: { error: 'client_not_initialized' } });
      return throwError(() => new Error('Auth0Client is not initialized'));
    }
  
    return from(this.auth0Client.getUser()).pipe(
      switchMap(user => {
        if (!user || !user.email) {
          console.error('Email not found in user data.');
          this.router.navigate(['/login']);
          return throwError(() => new Error('Email not found. Please login again.'));
        }

        const email = user.email;

        return from(this.auth0Client!.getTokenSilently()).pipe(
          switchMap(token => {
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            });
            return this.http.get(`${this.apiUrl}/user?email=${encodeURIComponent(email)}`, { headers });
          }),
          catchError(error => {
            console.error('Error fetching user data:', error);
            if (error.status === 401 || error.status === 403) {
              this.router.navigate(['/']);
              return throwError(() => new Error('Session expired. Please log in again.'));
            }
            return throwError(() => new Error('Failed to load user data'));
          })
        );
      }),
      catchError(error => {
        console.error('Error retrieving user profile:', error);
        this.router.navigate(['/']);
        return throwError(() => new Error('Failed to retrieve user profile.'));
      })
    );
  }
  public checkSession(): Observable<boolean> {
    if (!this.auth0Client) {
      console.error('Auth0Client is not initialized.');
      this.router.navigate(['/callback'], { queryParams: { error: 'client_not_initialized' } });
      return throwError(() => new Error('Auth0Client is not initialized'));
    }
    return from(this.auth0Client.checkSession()).pipe(
        switchMap(() => this.auth0Client!.isAuthenticated()),
        tap(isAuthenticated => this.loggedIn.next(isAuthenticated)),
        catchError(error => {
            console.error('Session check failed:', error);
            this.loggedIn.next(false);
            return of(false);
        })
    );
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
    this.auth0Client?.getTokenSilently().then((token: string) => {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      const userData = {
        email: user.email,
        username: user.nickname || 'defaultUsername',
        profilepictureurl: user.picture
      };
      this.http.post(`${this.apiUrl}/signup`, userData, { headers }).subscribe({
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
        const item = {
          value: token,
          expiry: now.getTime() + 3600000,
        };
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
  setUser(user: any) {
    this.userSource.next(user);
  }
}
