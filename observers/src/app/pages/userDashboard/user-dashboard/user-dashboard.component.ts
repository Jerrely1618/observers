import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { AuthServicesComponent } from '../../../auth/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthServicesComponent) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(
      data => {
        this.user = data;
        console.log('User data loaded', data);
      },
      error => {
        console.error('Error loading user data', error);
      }
    );
  }
}