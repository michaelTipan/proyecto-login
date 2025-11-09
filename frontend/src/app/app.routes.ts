import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { SingIn } from './components/sing-in/sing-in';
import { Dashboard } from './components/dashboard/dashboard';
import { Maintenance } from './components/maintenance/maintenance';
import { ErrorPage } from './components/error-page/error-page';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'logIn', component: Login},
    {path: 'signIn', component: SingIn},
    {path: 'dashboard', component: Dashboard},
    {path: 'maintenance', component: Maintenance},
    {path: 'errorPage', component: ErrorPage},
    { path: '**', redirectTo: '/errorPage', pathMatch: 'full' }
];
