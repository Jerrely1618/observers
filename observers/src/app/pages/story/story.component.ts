import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StoryService } from './story.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  imports: [CommonModule], 
  standalone: true
})
export class StoryComponent implements OnInit {
  stories: any[] = [];

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.storyService.getStories().subscribe(
      data => this.stories = data,
      error => console.error('There was an error!', error)
    );
  }
}
