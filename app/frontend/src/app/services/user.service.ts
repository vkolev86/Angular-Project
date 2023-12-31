import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/User';

const USER_KEY = 'User';
const USER_CART = 'Cart';
const PAYPAL = '__paypal_storage__';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject =
  new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient, private toastrService:ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser():User{
    return this.userSubject.value;
  }

  login(userLogin:IUserLogin):Observable<User>{
    localStorage.removeItem(USER_CART);
    localStorage.removeItem(PAYPAL);
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) =>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome back ${user.name}!`,
            'Login Successful', {
              positionClass: 'toast-top-right' 
           }
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed', {
            positionClass: 'toast-top-right' 
         });
        }
      })
    );
  }

  register(userRegiser:IUserRegister): Observable<User>{
    localStorage.removeItem(USER_CART);
    localStorage.removeItem(PAYPAL);
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome ${user.name}`,
            'Register Successful', {
              positionClass: 'toast-top-right' 
           }
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed', {
              positionClass: 'toast-top-right' 
           })
        }
      })
    )
  }


  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_CART);
    localStorage.removeItem(PAYPAL);
    window.location.reload();
  }

  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }
}
