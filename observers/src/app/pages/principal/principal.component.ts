import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Component, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import anime from 'animejs';
import { CommonModule } from '@angular/common';
import { LandingComponent } from '../../components/landing/landing.component';
import { StoryComponent } from '../story/story.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  standalone: true,
  imports: [StoryComponent, LandingComponent,CommonModule,NavbarComponent, FooterComponent]
})
export class PrincipalComponent implements AfterViewInit {
  currentView: 'story' | 'landing' = 'story';
  isSideFixed = false;
  constructor(private el: ElementRef) { }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isSideFixed = scrollPosition > 190;
  }
  ngAfterViewInit(): void {
    this.setupBorderAnimation();
  }

  private setupBorderAnimation(): void {
    const headers = this.el.nativeElement.querySelectorAll('h1');
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      this.setupAnimationForHeader(header);
    }
  }
  
  private setupAnimationForHeader(header: Element): void {
    header.addEventListener('mouseenter', () => {
      anime({
        targets: header,
        borderTopWidth: [4, 0],
        borderBottomWidth: [4, 0],
        easing: 'easeInOutQuad',
        duration: 200
      });
    });
  
    header.addEventListener('mouseleave', () => {
      anime({
        targets: header,
        borderTopWidth: [0, 2],
        borderBottomWidth: [0, 2],
        easing: 'easeInOutQuad',
        duration: 200
      });
    });
    
  }
  changeView(view: 'landing' | 'story'): void {
    this.currentView = view;
  }
}
