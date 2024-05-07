import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef  } from '@angular/core';
import { StoryService } from './story.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

interface Story {
  title: string;
  author: string;
  created_at: Date;
  content: string;
}
@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent]
})
export class StoryComponent implements OnInit {
  story?: Story;
  firstLetter: string = '';
  restOfContent: string = '';
  storyId?: number;
  mainContentTop: number = 0;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadStory(params['id']);
  });
  }
  constructor(private storyService: StoryService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}
  loadStory(id: number): void {
    this.storyService.getStory(id).subscribe(
      data => {
        this.story = data;
        if (data.content) {
          this.firstLetter = data.content.charAt(0);
          this.restOfContent = data.content.slice(1);
        }
      },
      error => console.error('There was an error!', error)
    );
    console.log('Loading story with id:', id);
  }
  adjustMainContentPosition(navBottom: number): void {
    this.mainContentTop = navBottom;
    this.cdr.detectChanges();
  }
}