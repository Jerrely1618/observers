import { Component } from '@angular/core';
import { AuthServicesComponent } from './auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  constructor(public authService: AuthServicesComponent) {}
  login(): void {
    this.authService.login();
  }

  signup(): void {
    this.authService.signup();
  }
}