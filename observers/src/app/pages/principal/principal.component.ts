import { Component, AfterViewInit, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import anime from 'animejs';
import { CommonModule } from '@angular/common';
import { LandingComponent } from '../../components/landing/landing.component';
import { StoryComponent } from '../story/story.component';
import { StoriesComponent } from '../stories/stories.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
  standalone: true,
  imports: [StoryComponent, StoriesComponent, LandingComponent, CommonModule, NavbarComponent, FooterComponent]
})
export class PrincipalComponent implements AfterViewInit {
  currentView: 'story' | 'landing' | 'stories' = 'landing';
  isSideFixed = false;
  selectedStoryId?: number;
  mainContentTop: number = 0;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) { }

  onStorySelected(storyId: number): void {
    this.currentView = 'story';
    this.selectedStoryId = storyId;
  }

  onStoriesViewed(): void {
    this.currentView = 'stories';
  }

  adjustMainContentPosition(navBottom: number): void {
    this.mainContentTop = navBottom;
    this.cdr.detectChanges();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isSideFixed = scrollPosition > 190;
  }

  ngAfterViewInit(): void {
    this.setupBorderAnimation();
    this.cdr.detectChanges();
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
