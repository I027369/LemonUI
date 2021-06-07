import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BackendService } from '../shared/backend.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('f') loginForm: NgForm;
  signup = true;
  constructor(private backendService: BackendService, private router: Router) { }

  ngOnInit() {
    // console.log(this.loginForm);
  }
  onSubmit(localForm: any) {
    this.signup = true;
    this.backendService.signupUser(
      this.loginForm.value.name,
      this.loginForm.value.email,
      this.loginForm.value.phone,
      this.loginForm.value.company,
      this.loginForm.value.password
    )
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            // show congrats page
            // alert(response);
            this.router.navigate(['/signup/successful']);
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

}
