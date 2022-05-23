import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user/user.service';
import {UserProfile} from '../model/UserProfile';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss']
})
export class FeedHeaderComponent implements OnInit {

  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      private userService: UserService,
  ) {
  }
  Types : string[] = ["ask","give"];
  typeT !: string;

  imageObj!: File;
  @Input()
  imageUrl = '';
  buttonDisabled = false;
  @Input()
  messageStuff = '';
  showError = false;
  @Input() currentUser!: UserProfile;
  @Input() showHome = true;
  @Output() postAddedStatusChange = new EventEmitter<boolean>();

  toggled = false;

  ngOnInit(): void {

  }

  // @ts-ignore
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.toggled = false;
  }

  addPost() {
    this.toggled = false;
    if (this.messageStuff.length === 0) {
      this.showError = true;
    } else {
      const body = {
        body: this.messageStuff,
        userId: this.currentUser.id,
        image: this.imageUrl && this.imageUrl.length > 0 ? this.imageUrl : null,
        typeT:this.typeT
      };
      this.buttonDisabled = true;
      // @ts-ignore

      this.userService.postFeed(body).subscribe(response => {
        this.imageUrl = "";
        if (response) {
          this.messageStuff = '';
          this.buttonDisabled = false;
          this.openSnackBar(response.status);
          this.postAddedStatusChange.emit(true);
          // this.userService.getFeeds(this.currentUser.id);
        } else {
          console.log('There was an error posting this post');
        }
        // @ts-ignore
      }, error => {
        this.imageUrl = "";
        this.openSnackBar(error.error.status);
      });
    }
  }


  openSnackBar(message: string) {
    // @ts-ignore
    this.snackBar.open(message ? message : 'Error' ? message : 'Error', null, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // @ts-ignore
  handleSelection(event) {
    this.messageStuff += event.emoji.native;
  }

  onImagePicked(event: Event): void {
    // @ts-ignore
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
    this.onImageUpload();
  }

  onImageUpload() {
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj);
    // @ts-ignore

    this.userService.imageUpload(imageForm).subscribe(res => {
      this.imageUrl = res.image;
      // @ts-ignore
    }, error => {
      this.openSnackBar('Could not upload Image Properly. Please try again');
      this.imageUrl = '';
    });
  }
}
