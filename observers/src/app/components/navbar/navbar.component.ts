import { Component, OnInit, NgZone } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true
})
export class NavbarComponent implements OnInit {
  @Input() pageTitle: string = 'Default Page Title';

  currentDate: string;
  currentTime: string;

  constructor(private zone: NgZone) {
    this.currentDate = this.formatDate(new Date());
    this.currentTime = this.formatTime(new Date());
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        this.currentTime = this.formatTime(new Date());
        this.zone.run(() => {}); 
      }, 1000);  
    });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }
}
