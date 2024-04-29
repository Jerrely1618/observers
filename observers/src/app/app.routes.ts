import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { StoryComponent } from './pages/story/story.component';
export const routes: Routes = [
    { path: '', component: PrincipalComponent },
    { path: 'story', component: StoryComponent },
];
