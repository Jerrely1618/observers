import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../pages/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Processing login...</p>',
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query parameters received:', params);
      if (params['code'] && params['state']) {
        if (this.authService.validateState(params['state'])) {
          this.authService.handleAuthentication().then(() => {
            console.log('Authentication successful');
            this.router.navigate(['/user']);
          }).catch(error => {
            console.error('Error during authentication:', error);
            this.router.navigate(['/error'], { queryParams: { error: 'authentication_failed' } });
          });
        } else {
          console.error('State mismatch error');
          this.router.navigate(['/error'], { queryParams: { error: 'invalid_state' } });
        }
      } else {
        console.error('Code or state missing in the URL');
        this.router.navigate(['/error'], { queryParams: { error: 'missing_code_or_state' } });
      }
    });
  }
}