import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private apiUrl = 'http://localhost:3000/stories';

  constructor(private http: HttpClient) {}

  getStories(): Observable<any> {
    return of([{ id: 1, title: 'Sample Story', content: 'This is a sample story.' }]);
    // return this.http.get(this.apiUrl);
  }

  addStory(story: any): Observable<any> {
    return this.http.post(this.apiUrl, story);
  }
}