import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import {MatBadgeModule} from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ProfileComponent } from './profile/profile.component';
import { AppComponent } from './app.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {FeedItemComponent} from './feed-item/feed-item.component'
import  {AddQuoteComponent} from  './add-quote/add-quote.component';
import  { AddCommentComponent } from './add-comment/add-comment.component'
import  {FeedDetailComponent} from './feed-detail/feed-detail.component';
import {FeedItemMinimizedComponent} from "./feed-item-minimized/feed-item-minimized.component";
import {CommentDetailComponent} from "./comment-detail/comment-detail.component";
import {ConnectionsComponent} from "./connections/connections.component";
import {HomeComponent} from "./home/home.component";
import {FeedHeaderComponent} from "./feed-header/feed-header.component";
import {NotificationComponent} from "./notification/notification.component";
import { AuthInterceptor } from './services/authconfig.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    CreateUserComponent,
    ProfileComponent,
    ChangePasswordComponent,
    FeedItemComponent,
    AddQuoteComponent,
    FeedDetailComponent,
    AddCommentComponent,
    FeedItemMinimizedComponent,
    CommentDetailComponent,
    ConnectionsComponent,
    HomeComponent,
    FeedHeaderComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
      ReactiveFormsModule,
    FormsModule,
    PickerModule,
    HttpClientModule,
    MatBadgeModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
