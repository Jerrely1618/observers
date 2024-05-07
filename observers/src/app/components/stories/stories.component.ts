import { ChangeDetectorRef, Component, EventEmitter, Output  } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoriesService } from './stories.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent]
})
export class StoriesComponent {
  @Output() storySelected = new EventEmitter<number>();
  stories$: Observable<any[]>;
  mainContentTop: number = 0;
  private searchTextSubject = new BehaviorSubject<string>('');
  onStoryClick(storyId: number): void {
    this.storySelected.emit(storyId);
  }
  constructor(private storiesService: StoriesService, private cdr: ChangeDetectorRef) {
    this.stories$ = this.searchTextSubject.asObservable().pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.storiesService.getStories(query))
    );
  }
  
  adjustMainContentPosition(navBottom: number): void {
    this.mainContentTop = navBottom;
    this.cdr.detectChanges();
  }
  clearSearch() {
    this.searchText = '';
    this.searchTextSubject.next(this.searchText);
  }
  adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  searchStories(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      event.preventDefault();
      this.stories$ = this.storiesService.getStories(this.searchText);
    }
  }

  startSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        this.searchText = speechToText;
        this.searchTextSubject.next(this.searchText);
      };
    } else {
      console.error('SpeechRecognition is not supported in this browser.');
    }
  }

  searchText = '';
}
