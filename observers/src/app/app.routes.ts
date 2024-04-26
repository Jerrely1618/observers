import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { StoryComponent } from './pages/story/story.component';
export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'story', component: StoryComponent },
];
