import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {UserProfile} from '../model/UserProfile';
import {DomSanitizer} from '@angular/platform-browser';
import {UserService} from '../services/user/user.service';
import { Feed } from 'src/app/model/Feed';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConnectionsComponent} from '../connections/connections.component';
import {UserMinified} from '../model/UserMinified';

import { Router,ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  t:any = "home";
  sub!:any ;

    constructor(
        public authService: AuthService,
        private userService: UserService,
        // tslint:disable-next-line:variable-name
        private _snackBar: MatSnackBar,
        private sanitizer: DomSanitizer,
        private Activatedroute:ActivatedRoute,
        private router:Router,
        private location: Location) {
    }
    currentUser!: UserProfile ;

    @ViewChild(ConnectionsComponent) conn!: ConnectionsComponent;
    isSelectedItem = 0;
    sidebarIconList = ['home', 'face', 'notifications_none','help','card_giftcard', 'login'];
    sidebarList = ['Home', 'Profile', 'Notifications','askers','givers', 'Logout'];
    connectionList: Array<UserMinified> = [];
    feedList: Array<Feed> = [];
    isLoading = true;
    imageSource = null;
    selectedUserProfile!: UserMinified;

    ngOnInit(): void {
      this.sub=this.Activatedroute.paramMap.subscribe(params => {
        if(params.get('type')!=null){
          this.t = params.get('type');
        }

      });
        this.currentUser = this.authService.currentUser;
        if (this.currentUser == null) {
            this.router.navigate(['/login']);
        } else {
            this.sidebarList[1] = this.currentUser.user_handle;
            // @ts-ignore
          this.imageSource = this.currentUser.profile_pic;
            // this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.currentUser.profile_pic}`);
            this.userService.getConnections(this.currentUser.id).subscribe(response => {
                if (response) {
                    this.connectionList = response;
                }
            }, error => {
                this.openSnackBar(error.error.status);
            });
            this.loadPosts();
        }

    }

    loadPosts() {

        this.isLoading = true;
        this.userService.getFeeds(this.currentUser.id,this.t).subscribe(response => {
            if (response) {
                this.isLoading = false;
                this.feedList = response;
            }
        }, error => {
          console.log(error)
            this.openSnackBar(error.error);
        });
    }

    menuSelect(i: number) {
        this.isSelectedItem = i;
        switch (i) {
            case 0:
              this.location.go("/home")
              this.t="home"
              this.loadPosts();
                break;
            case 1:
              this.location.go("/profile")
                break;
            case 2:
              this.location.go("/notifications")
               break;
          case 3:
            this.location.go("/askers")
            this.t="ask"
            this.loadPosts();
            break;
          case 4:
            this.t="give"
            this.loadPosts();
            this.location.go("/givers")
            break;
            case 5:
              // @ts-ignore
              this.authService.setUser(null);
                sessionStorage.removeItem('user');
                this.router.navigate(['/login']);
                break;
        }
    }

    openSnackBar(message: string) {
        // @ts-ignore
      this._snackBar.open(message ? message : 'Error', null, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }

    getUserProfile(user: UserMinified) {
        this.selectedUserProfile = user;
        this.isSelectedItem = -1;
        this.conn.loadPosts(user.user_handle);
    }
  ngOnChanges(){
    this.sub=this.Activatedroute.paramMap.subscribe(params => {
      if(params.get('type')!=null){
        this.t = params.get('type');
      }
    });
    this.loadPosts();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  // ngDoCheck(){
  //   this.sub=this.Activatedroute.paramMap.subscribe(params => {
  //     console.log(params.get('type')+"  "+this.t)
  //   //   if(params.get('type')!=null){
  //   //     if(this.t!=params.get('type')){
  //   //       this.t = params.get('type');
  //   //     }
  //   //   }
  //     // this.loadPosts();
  //   });
  //
  //
  // }

}
