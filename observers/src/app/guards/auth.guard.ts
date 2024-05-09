import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServicesComponent } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthServicesComponent, private router: Router) {}

    canActivate(): Observable<boolean> {
      return this.authService.checkSession().pipe(
        map(isAuthenticated => {
          if (!isAuthenticated) {
              this.router.navigate(['/']);
              return false;
          }
          return true;
        }),
        catchError((error: any) => {
            console.error('Error during authentication check', error);
            this.router.navigate(['/']);
            return of(false);
        })
      );
    }
  
}