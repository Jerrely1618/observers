import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  imports: [NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  standalone: true
})
export class LandingComponent {

}
