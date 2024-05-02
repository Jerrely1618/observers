import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { AuthGuard } from './guards/auth.guard';
import { UserDashboardComponent } from './pages/userDashboard/user-dashboard/user-dashboard.component';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
    { path: '', component: PrincipalComponent },
    {path: 'error', component: ErrorComponent},
    { path: 'callback', component: AuthCallbackComponent },
    { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuard] },
];