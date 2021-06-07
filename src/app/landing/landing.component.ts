import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BackendService } from '../shared/backend.service';
import { UserAccount } from '../shared/account.service';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RestaurantDetails } from '../shared/restaurant.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  displayLogin: boolean;
  displaySignup: boolean;
  signup = true;
  @ViewChild('f') loginForm: NgForm;
  authorized = true;
  emailErr = false;
  passwordErr = false;


  constructor(private backendService: BackendService, private user: UserAccount,
    private restDetails: RestaurantDetails,
    private router: Router) { }

  ngOnInit() {
  }


  // LOGIN PROCESS START

  showLoginDialog() {
    this.displayLogin = true;
    this.displaySignup = false;
  }

  onSubmit(localForm: any) {
    this.authorized = true;
    this.backendService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.displayLogin = false;
            this.user.setUserTokenDetails(response);
            this.getUserDetails(this.loginForm.value.email);

          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showError(error);
          }
        }
      );
  }

  private getUserDetails(email: string) {
    this.backendService.fetchUserDetails(this.loginForm.value.email)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.user.setUserDetails(response);
            this.getRestaurantDetails();
            // console.log('user ', this.user);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            // console.log('Processing http error', error.error.error);
            this.showError(error);
          }
        }
      );
  }

  getRestaurantDetails() {
    this.backendService.getRestaurantDetails(this.user.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.restDetails.setRestaurantDetails(response);
            this.router.navigate(['/home']);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showError(error);
          }
        }
      );
  }

  showError(error: HttpErrorResponse) {
    this.authorized = false;
  }

  emailClicked() {
    if (this.loginForm.value.email != null) {
      if (this.loginForm.value.email.length > 0) {
        this.emailErr = true;
      }
    }
  }
  passwordClicked() {
    if (this.loginForm.value.password == null) {
      this.passwordErr = true;
    } else if (this.loginForm.value.password.length === 0) {
      this.passwordErr = true;
    }
  }

  passwordFocus() {
    if (this.loginForm.value.email != null) {
      if (this.loginForm.value.email.length === 0) {
        this.emailErr = true;
      }
    }
  }
// LOGIN PROCESS END



  // SIGNUP PROCESS START
  showSignUpDialog() {
    this.displaySignup = true;
    this.displayLogin = false;
  }

  onSubmitSignup(localForm: any) {
    this.signup = true;
    this.backendService.signupUser(
      localForm.value.name,
      localForm.value.signupemail,
       '',
       '',
     // localForm.value.phone,
     // localForm.value.company,
      localForm.value.signuppassword
    )
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            // show congrats page
            // alert(response);
            this.router.navigate(['/signup/successful']);
            this.displaySignup = false;
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            // console.log('Processing http error', error.error.error);
            this.signup = false;
          }
        }
      );
  }

  // SIGNUP PROCESS START

}
