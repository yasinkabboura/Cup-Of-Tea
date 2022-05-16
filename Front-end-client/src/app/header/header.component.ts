import { Component, OnInit } from '@angular/core';
import {UserProfile} from "../model/UserProfile";
import {AuthService} from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser!: UserProfile ;

  constructor(public authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }
  logou(){
    // @ts-ignore
    this.authService.setUser(null);
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }


}
