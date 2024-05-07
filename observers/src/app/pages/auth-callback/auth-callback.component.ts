import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthServicesComponent } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Processing login...</p>',
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthServicesComponent, 
    private route: ActivatedRoute, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe({
        next: (params) => {
          this.authService.handleAuthentication().catch(error => {
            console.error('Authentication error:', error);
            this.router.navigate(['/error'], { queryParams: { error: 'authentication_failed' } });
          });
        }
      });
    }
  }

}