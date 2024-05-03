import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(CommonModule),
    importProvidersFrom(HttpClientModule),
    provideAuth0({
      domain: 'dev-jx5b0ki2qctj8hxd.us.auth0.com',
      clientId: '1h4ucTDXA9vVDd2A0oAAMObRaqLqa8vV',
      authorizationParams: {
        redirect_uri: 'https://localhost:4200/callback',
        audience: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/api/v2/'
      }
      
    }),
  ]
};
