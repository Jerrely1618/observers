import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  private originalItems = [1, 2, 3, 4];
  visibleItems: number[] = this.originalItems.slice(0, 4);

  constructor() { }

  swipeLeft(): void {
    this.originalItems.push(this.originalItems.shift()!);
    this.visibleItems = this.originalItems.slice(0, 4);
  }

  swipeRight(): void {
    this.originalItems.unshift(this.originalItems.pop()!);
    this.visibleItems = this.originalItems.slice(0, 4);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const currentX = event.touches[0].clientX;
    const diffX = this.startX - currentX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        this.swipeLeft();
      } else {
        this.swipeRight();
      }
      this.startX = currentX; 
    }
  }
  
  private startX!: number;
}
