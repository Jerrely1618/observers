import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { AuthServicesComponent } from '../../../auth/auth.service';
import { NavbarUserComponent } from '../../../components/navbar-user/navbar-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarUserComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  user: any;
  selectedTab: string = 'following';
  constructor(public authService: AuthServicesComponent) {}

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
  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}