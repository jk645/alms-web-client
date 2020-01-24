import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnauthOnlyGuard } from './unauth-only-guard.service';
import { AuthGuard } from './auth-guard.service';

import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CoursesComponent } from '../courses/courses.component';


const appRoutes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthOnlyGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true
      }
    )
  ],
  providers: [
    UnauthOnlyGuard,
    AuthGuard,
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
