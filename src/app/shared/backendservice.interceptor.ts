import { UserAccount } from './account.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendServiceInterceptor implements HttpInterceptor {
    oauthURL = 'http://testrestaurant.us-east-2.elasticbeanstalk.com/oauth/token';
    signupUser = 'http://testrestaurant.us-east-2.elasticbeanstalk.com/accountusers';

   //  oauthURL = 'http://localhost:5000/oauth/token';
   //  signupUser = 'http://localhost:5000/accountusers';

    constructor(private user: UserAccount) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if ( req.url === this.oauthURL) {
           return next.handle(req);
        } else if (req.url === this.signupUser) {
            return next.handle(req);
        } else {
            const copiedRequest = req.clone({ params: req.params.set('access_token', this.user.access_token) });
            return next.handle(copiedRequest);
        }
    }
}
