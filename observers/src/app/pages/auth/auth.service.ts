import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0Client?: Auth0Client;
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private errors: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.auth0Client = new Auth0Client({
        domain: environment.AUTH0_DOMAIN,
        clientId: environment.AUTH0_CLIENT_ID,
        authorizationParams: {
          redirectUri: `${window.location.origin}/callback`,
        }
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
  public handleAuthentication(): Promise<void> {
    if (!this.auth0Client || !window.location.search) {
      const error = 'No search parameters available for Auth0 callback.';
      console.error(error);
      this.errors.next(error);
      return Promise.reject(error);
    }
    return this.auth0Client.handleRedirectCallback().then(res => {
      return this.auth0Client!.isAuthenticated();
    }).then(isAuthenticated => {
      if (!isAuthenticated) {
        throw new Error('Authentication failed');
      }
      this.loggedIn.next(true);
      this.router.navigate(['/user']); // Confirm this is a valid and allowed route
    }).catch(error => {
      console.error('Error processing authentication:', error);
      this.errors.next(error.message);
      throw error;
    });
  }
  
  
  public checkAuthenticationStatus(): Promise<boolean> {
    if (!this.auth0Client) {
      console.error('Auth0Client not initialized');
      return Promise.resolve(false);
    }
    return this.auth0Client.isAuthenticated().then(isAuthenticated => {
      this.loggedIn.next(isAuthenticated);
      if (isAuthenticated) {
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
      }
      return isAuthenticated;
    }).catch(error => {
      console.error('Error checking authentication status:', error);
      return false;
    });
  }
  public login(mode?: string): void {
    if (!isPlatformBrowser(this.platformId) || !this.auth0Client) return;
  
    const loginOptions = {
      redirectUri: `${window.location.origin}/callback`,
      appState: { mode }
    };
    this.auth0Client.loginWithRedirect(loginOptions).catch(error => {
      console.error('Login failed:', error);
      this.errors.next(error.description || 'Failed to login');
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
