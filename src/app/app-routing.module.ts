import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {AdminAuthGuard} from './auth-guard/admin-auth.guard';
import {AdminAuthStateGuard} from './auth-guard/admin-auth-state.guard';

const routes: Routes = [
  {
    path: environment.adminLoginUrl,
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [AdminAuthStateGuard]
  },
  {
    path: environment.adminBaseUrl,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AdminAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
