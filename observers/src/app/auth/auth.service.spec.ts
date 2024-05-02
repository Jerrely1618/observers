import { TestBed } from '@angular/core/testing';

import { AuthServicesComponent } from './auth.service';

describe('AuthService', () => {
  let service: AuthServicesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServicesComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
