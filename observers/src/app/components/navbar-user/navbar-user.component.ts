import { CommonModule } from '@angular/common';
import { Component, EventEmitter,ElementRef, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { AuthComponent } from '../../auth/auth.component';
import { TopwatchersComponent } from '../topwatchers/topwatchers.component';
import { SingleAdComponent } from '../single-ad/single-ad.component';
import { ContactComponent } from '../contact/contact.component';
import { AuthServicesComponent } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar-user',
  imports: [CommonModule, AuthComponent,TopwatchersComponent, SingleAdComponent, ContactComponent],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.scss',
  standalone: true,
})
export class NavbarUserComponent implements OnInit {
  @Input() pageTitle: string = 'Default Page Title';
  @Input() authService?: AuthServicesComponent;

  @Output() storiesView = new EventEmitter<string>();
  @Output() bottomNav = new EventEmitter<number>();
  isNavbarFixed = false;
  currentDate: string;
  currentTime: string;
  @ViewChild('navbarElement') navbarElement!: ElementRef;
  
  constructor(private zone: NgZone) {
    this.currentDate = this.formatDate(new Date());
    this.currentTime = this.formatTime(new Date());
  }
  ngAfterViewInit() {
    this.logInitialPosition();
  }
  logout() {
    this.authService?.logout();
  }
  logInitialPosition() {
    if (this.navbarElement) {
      const navbarTop = this.navbarElement.nativeElement.offsetTop;
      const navbarHeight = this.navbarElement.nativeElement.offsetHeight;
      const navbarBottomFromTop = navbarTop + navbarHeight;
      this.bottomNav.emit(navbarBottomFromTop);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!this.isNavbarFixed && this.navbarElement) {
      const navbarTop = this.navbarElement.nativeElement.offsetTop;
      const navbarHeight = this.navbarElement.nativeElement.offsetHeight;
      const navbarBottomFromTop = navbarTop + navbarHeight;
      this.bottomNav.emit(navbarBottomFromTop);
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isNavbarFixed = scrollPosition > 175;
  }
  onStoriesView(): void {
    this.storiesView.emit('stories');
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

