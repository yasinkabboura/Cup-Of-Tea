import {Component, OnInit} from '@angular/core';
import {UserSignupInfo} from '../model/UserSignupInfo';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  // @ts-ignore
  signUpData: UserSignupInfo = new UserSignupInfo();
  imageSrc: any = "hbjk";
  password = '';
  cPassword = '';
  passwordVisible = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private snackBar: MatSnackBar,
      private authService: AuthService,
  ) { }

  ngOnInit(): void {

  }

  openSnackBar(message: string) {
    // @ts-ignore
    this.snackBar.open(message ? message : 'Error', null, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  signUpUser() {

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
