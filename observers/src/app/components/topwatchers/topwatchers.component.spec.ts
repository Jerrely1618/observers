import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopwatchersComponent } from './topwatchers.component';

describe('TopwatchersComponent', () => {
  let component: TopwatchersComponent;
  let fixture: ComponentFixture<TopwatchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopwatchersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopwatchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
