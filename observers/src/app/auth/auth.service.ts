import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
      this.auth0Client = new Auth0Client({
        domain: 'dev-jx5b0ki2qctj8hxd.us.auth0.com',
        clientId: '1h4ucTDXA9vVDd2A0oAAMObRaqLqa8vV',
        authorizationParams: {
          redirect_uri: 'https://localhost:4200/callback',
          audience: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/api/v2/'
        },
      });
      this.checkAuthenticationStatus();
    }
  }
  public saveState(state: string): void {
    sessionStorage.setItem('auth_state', state);
  }

  public validateState(state: string): boolean {
    const savedState = sessionStorage.getItem('auth_state');
    return state === savedState;
  }
  public isClientInitialized(): boolean {
    return !!this.auth0Client;
  }
  public async handleAuthentication(): Promise<void> {
    if (!this.auth0Client) {
      console.error('Auth0Client is not initialized.');
      this.router.navigate(['/error'], { queryParams: { error: 'client_not_initialized' } });
      return;
    }

    try {
      const { appState } = await this.auth0Client.handleRedirectCallback();
      const isAuthenticated = await this.auth0Client.isAuthenticated();
      this.loggedIn.next(isAuthenticated);
      if (isAuthenticated) {
        this.handlePostAuthentication();
        this.router.navigate(['/user']);
      } else {
        this.router.navigate(['/'], { queryParams: { error: 'authentication_failed' } });
      }
    } catch (error) {
      console.error('Error processing authentication:', error);
      this.errors.next(error);

      if (error instanceof Error) {
        this.router.navigate(['/'], { queryParams: { error: 'authentication_exception', details: error.message } });
      } else {
        this.router.navigate(['/'], { queryParams: { error: 'authentication_exception', details: 'An unknown error occurred' } });
      }
    }
  }
  
  
  private async handlePostAuthentication(): Promise<void> {
    if (this.auth0Client) {
      const user = await this.auth0Client.getUser();
      if (user) {
        this.createUserInDatabase(user);
      }
    }
  }

  private createUserInDatabase(user: any): void {
    this.auth0Client?.getIdTokenClaims().then((tokenClaims: any) => {
      const headers = {
        Authorization: `Bearer ${tokenClaims.__raw}`
      };
      console.log('Sending headers:', headers); // Log headers
      this.http.post(`${this.apiUrl}/users`, {
        email: user.email,
        name: user.name
      }, { headers }).subscribe({
        next: (response) => console.log('User created in database:', response),
        error: (err) => console.error('Error creating user in database:', err)
      });
    }).catch(error => {
      console.error('Error retrieving token:', error);
    });
  }

  private async checkAuthenticationStatus() {
    if (this.auth0Client) {
      const isAuthenticated = await this.auth0Client.isAuthenticated();
      this.loggedIn.next(isAuthenticated);
    }
  }

  public login(): void {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) return;
    this.auth0Client.loginWithRedirect();
  }

  public signup(): void {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) return;
    this.auth0Client.loginWithRedirect({
      appState: {
        target: '/user',
      },
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  }

  public logout(): void {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) return;
    this.auth0Client.logout();
    this.loggedIn.next(false);
  }


  public isAuthenticated(): BehaviorSubject<boolean> {
    return this.loggedIn;
  }

  public getErrors(): Observable<any> {
    return this.errors.asObservable();
  }
  public isLoggedIn(): boolean {
    return this.isAuthenticated().getValue(); 
  }
}
