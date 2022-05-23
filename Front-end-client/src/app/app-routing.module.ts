import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {CreateUserComponent} from './create-user/create-user.component';
import {ProfileComponent} from "./profile/profile.component";
import  {FeedDetailComponent} from  './feed-detail/feed-detail.component'
import  { HomeComponent} from "./home/home.component";


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:type', component: HomeComponent },
  { path: 'signup-complete', component: CreateUserComponent },
  // { path: 'profile', component: ProfileComponent },
  { path: 'password-Change', component: ChangePasswordComponent },
  { path: 'feed/:id', component: FeedDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
