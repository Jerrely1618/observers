import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { TopwatchersComponent } from '../../components/topwatchers/topwatchers.component';
import { SingleAdComponent } from '../../components/single-ad/single-ad.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import anime from 'animejs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [CommonModule,NavbarComponent, FooterComponent, SingleAdComponent, ContactComponent, TopwatchersComponent]
})
export class LandingComponent implements AfterViewInit {

  constructor(private el: ElementRef) { }

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
        borderTopWidth: [0, 4],
        borderBottomWidth: [0, 4],
        easing: 'easeInOutQuad',
        duration: 200
      });
    });
  }
}
