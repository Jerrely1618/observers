import { Component, Input,ViewChild,ElementRef, EventEmitter, OnInit, NgZone, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopwatchersComponent } from '../topwatchers/topwatchers.component';
import { SingleAdComponent } from '../single-ad/single-ad.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, TopwatchersComponent, SingleAdComponent, ContactComponent],
  standalone: true
})
export class NavbarComponent implements OnInit {
  @Input() pageTitle: string = 'Default Page Title';
  @Output() storiesView = new EventEmitter<string>();
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

  logInitialPosition() {
    if (this.navbarElement) {
      const navbarHeight = this.navbarElement.nativeElement.offsetHeight;
      console.log('Initial navbar height:', navbarHeight);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    if (!this.isNavbarFixed) {
      const navbarHeight = this.navbarElement.nativeElement.offsetHeight;
      console.log('Navbar height on resize:', navbarHeight);
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
