import { Router } from '@angular/router';
import { UserAccount } from './../shared/account.service';
import { BackendService } from './../shared/backend.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('f') loginForm: NgForm;
  authorized = true;
  emailErr = false;
  passwordErr = false;

  constructor(private backendService: BackendService, private user: UserAccount, private router: Router) {}

  ngOnInit() {
  }

  // onSubmit(form:  NgForm) {
  //   console.log(form);
  // }
  onSubmit(localForm: any) {
    this.authorized = true;
    this.backendService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          (response) => {
            if (response instanceof HttpResponse) {
              this.user.setUserTokenDetails(response);
              this.getUserDetails(this.loginForm.value.email);
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

  private getUserDetails(email: string) {
    this.backendService.fetchUserDetails(this.loginForm.value.email)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.user.setUserDetails(response);
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

  showError(error: HttpErrorResponse) {
    this.authorized = false;
  }

  emailClicked() {
    if (this.loginForm.value.email != null ) {
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

  }


