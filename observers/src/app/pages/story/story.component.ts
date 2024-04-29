import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StoryService } from './story.service';

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
  imports: [CommonModule]
})
export class StoryComponent implements OnInit {
  story?: Story;
  firstLetter: string = '';
  restOfContent: string = '';
  ngOnInit(): void {
    this.loadStory(1);
  }
  constructor(private storyService: StoryService) {}
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
  }
}