import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { AuthGuard } from './guards/auth.guard';
import { UserDashboardComponent } from './pages/userDashboard/user-dashboard/user-dashboard.component';

export const routes: Routes = [
    { path: '', component: PrincipalComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'callback', component: AuthCallbackComponent },
    { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuard]  },
];