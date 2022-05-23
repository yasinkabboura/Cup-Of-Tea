import {Component, Input, OnInit} from '@angular/core';
import {UserProfile} from '../model/UserProfile';
import {Router} from '@angular/router';
import {Feed} from '../model/Feed';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user/user.service';
import {UserMinified} from "../model/UserMinified";
import {UserSignupInfo} from "../model/UserSignupInfo";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user!: UserProfile;
  isSelectedItem = 0;
  currentPassword!: string;
  DateLog!:any;
  isLoading = true;
  connectionList: Array<UserMinified> = [];
  feedList: Array<Feed> = [];
  signUpData: UserSignupInfo = new UserSignupInfo();
  imageSrc: any = "hbjk";
  password = '';
  @Input() userProfileShort!: UserMinified;
  cPassword = '';
  passwordVisible = false;

  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      private authService: AuthService,
      private  userService:UserService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (this.user == null) {
      this.router.navigate(['/login']);
    }
    this.userService.getConnections(this.user.id).subscribe(response => {
      if (response) {
        this.connectionList = response;
      }
    }, error => {
      this.openSnackBar(error.error.status);
    });
    this.loadPosts(this.user.user_handle);

  }
  loadPosts(username: string) {
    this.isLoading = true;
    this.userService.getUserProfile(username, this.authService.currentUser.id).subscribe(response => {
      if (response) {
        console.log(response)
        this.isLoading = false;
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
  selected(i:number){
    this.isSelectedItem = i;
    switch (i) {
      case 0:
        break;
      case 1:
        break;
    }

  }

  modifyUpUser() {

    const body = {
      image_src: this.imageSrc,
      name: this.signUpData.name,
      email_id: this.signUpData.email_id,
      user_handle: this.signUpData.user_handle,
      location: 'EST',
      bio: this.signUpData.bio,
      password: this.password,
      password_conf: this.cPassword,
    };
    console.log(body)
    this.authService.createUser(body).subscribe(response => {
      this.openSnackBar(response.status);
      this.router.navigate(['/login']);
    }, error => {
      this.openSnackBar(error.error.status);
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
