import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StoriesService } from './stories.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent {
  stories$: Observable<any[]>;
  searchControl = new FormControl();

  constructor(private storiesService: StoriesService) {
    this.stories$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.storiesService.getStories(query))
    );
  }
}
