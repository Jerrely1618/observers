import { TestBed } from '@angular/core/testing';
import { StoryService } from './story.service';
describe('StorySevice', () => {
  let service: StoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
