import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  private apiUrl = 'http://localhost:3000/stories';

  constructor(private http: HttpClient) { }

  getStories(query?: string): Observable<any[]> {
    let url = this.apiUrl;
    if (query) {
      url += `?search=${query}`;
    }
    return this.http.get<any[]>(url);
  }
}
