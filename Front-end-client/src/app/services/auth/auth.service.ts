import { Injectable } from '@angular/core';
import {HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpBackend, HttpContext} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

import { UserProfile } from '../../model/UserProfile';
import { UserSignupInfo } from '../../model/UserSignupInfo';
import {StorageService} from "../storage.service";
import {Router} from "@angular/router";
import {BYPASS_LOG} from "../authconfig.interceptor";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private storageService:StorageService,public router: Router) {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      this.currentUser = userObj;
    }
  }
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  localLink = 'http://localhost:8085';
  link = this.localLink;
  currentUser!: UserProfile ;
  currentUserSignUpInfo!: UserSignupInfo ;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

   /** Log a message from Auth Service */
   private static log(message: string) {
    console.log(`Auth Service: ${message}`);
  }

  // Sign-up
  createUser(user: any): Observable<any> {
    let api = `${this.link}/register-user`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }


  // Sign-in
  login(username:string, password:string) {
    const body = {
      "username": username,
      "password":password
    };
    console.log(body)
    return this.http
      .post<any>(`${this.link}/login`, body,{ context: new HttpContext().set(BYPASS_LOG, true) })
      .subscribe((res: any) => {
        console.log("*********************************************")
        console.log(res)
        this.storageService.saveToken(res.accessT)
        this.storageService.saveRefreshToken(res.refreshT);
        var json = JSON.parse(res.user);
        console.log(json)
        this.currentUser = json;
        this.storageService.saveUser(json);

      });
  }


  getToken() {
    return this.storageService.getToken();
  }
  get isLoggedIn(): boolean {
    let authToken = this.storageService.getToken();
    return authToken !== null ? true : false;
  }
  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }
  // UserModel profile
  getUserProfile(id: any): Observable<any> {
    let api = `${this.link}/auth/profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  refreshToken(token: string) {
    // let header = new HttpHeaders().set("Authorization", 'Bearer ' + token);
    // let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token});
    let heade =  {headers: new  HttpHeaders({ 'Authorization': 'Bearer ' + token})};
    // @ts-ignore
    return this.http.post(this.link + '/auth/refreshToken',{ headers: this.headers },heade);
  }
  getRole(){
    console.log(this.storageService.getUser().appRoles)
    return this.storageService.getUser().appRoles;
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }


  changePassword(body: any, userId: string): Observable<any> {
     const headers = { userId };
     return this.http.put<any>('http://' + this.link + '/put/change-password', body, { headers });
  }


  setNotificationCount(count: number) {
    this.currentUser.notification_count = count;
    sessionStorage.setItem('user', JSON.stringify(this.currentUser));
  }



}
