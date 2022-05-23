import {Component, Input, OnInit} from '@angular/core';
import {Feed} from '../model/Feed';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserProfile} from '../model/UserProfile';
import {UserMinified} from '../model/UserMinified';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {

  isLoading = true;
  feedList: Array<Feed> = [];
  user!: UserMinified;

  @Input() userProfileShort!: UserMinified;

  constructor(
      private router: Router,
      private authService: AuthService,
      private userService: UserService,
      // tslint:disable-next-line:variable-name
      private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadPosts(this.userProfileShort.user_handle);
  }

  loadPosts(username: string) {
    this.isLoading = true;
    // @ts-ignore
    // @ts-ignore
    this.userService.getUserProfile(username, this.authService.currentUser.id).subscribe(response => {
      if (response) {
        this.isLoading = false;
        this.user = this.userProfileShort;
        this.feedList = response;
      }
    }, error => {
      this.openSnackBar(error.error.status);
    });
  }

  openSnackBar(message: string) {
    // @ts-ignore
    this.snackBar.open(message ? message : 'Error', null, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
