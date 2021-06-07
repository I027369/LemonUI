import { UserAccount } from './account.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { error } from 'util';
import { Router } from '@angular/router';

// tslint:disable-next-line:no-trailing-whitespace
@Injectable()
export class BackendService {


    baseUrl = 'http://testrestaurant.us-east-2.elasticbeanstalk.com';
    oauthURL = 'http://testrestaurant.us-east-2.elasticbeanstalk.com/oauth/token';

   // baseUrl = 'http://localhost:8080';
   // oauthURL = 'http://localhost:8080/oauth/token';
    headers = new HttpHeaders().set('ContentType', 'application/x-www-form-urlencoded;charset=UTF-8')
                               .append('Authorization', 'Basic bXktdHJ1c3RlZC1jbGllbnQ6c2VjcmV0');
    passwordParams = new HttpParams().set('grant_type', 'password');
    refrehTokenParams = new HttpParams().set('grant_type', 'refresh_token');
    constructor(private http: HttpClient, private user: UserAccount, private router: Router) {}

    public loginUser(email: string, password: string) {
        const req = new HttpRequest('POST', this.oauthURL, '',
            { headers: this.headers, params: this.passwordParams.append('username', email).append('password', password) });
        return this.http.request(req);
    }
    public fetchUserDetails(email: string) {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/accountusers/emails/' + email);
        return this.http.request(req);
    }
    public signupUser(name: string, email: string, phone: string, company: string, password: string) {
        const body = {
            'name': name,
            'emailId': email,
            'phone': phone,
            'company': company,
            'password': password,
            'role': 'admin'
        };
        const req = new HttpRequest('POST', this.baseUrl + '/accountusers', body);
        return this.http.request(req);
    }

    public getRestaurantDetails(restaurantId: string) {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/restaurants/' + restaurantId);
        return this.http.request(req);
    }

    public saveRestaurant(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/restaurants/' + arg0, arg1);
        return this.http.request(req);
    }

    getMenus(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/restaurants/' + arg0 + '/menus');
        return this.http.request(req);
    }
    saveMenu(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/menus', arg0);
        return this.http.request(req);
    }
    updateMenu(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menus/' + arg0, arg1);
        return this.http.request(req);
    }
    updateMenuStatus(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menus/' + arg0, '',
            {headers: new HttpHeaders().set('ContentType', 'application/json').append('Content-Type', 'application/json'),
             params: new HttpParams().set('status', arg1) });
        return this.http.request(req);
    }
    getMenu(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menus/' + arg0 );
        return this.http.request(req);
    }
    deleteMenu(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/menus/' + arg0);
        return this.http.request(req);
    }
    saveMenuItem(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/menuitems', arg0);
        return this.http.request(req);
    }
    getMenuItem(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menuitems/' + arg0);
        return this.http.request(req);
    }
    updateMenuItem(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menuitems/' + arg0, arg1);
        return this.http.request(req);
    }
    deleteMenuItem(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/menus/' + arg0 + '/menuitems/' + arg1);
        return this.http.request(req);
    }
    getMenuItems(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menus/' + arg0 + '/menuitems/all');
        return this.http.request(req);
    }
    updateMenuItemStatus(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menuitems/' + arg0, '',
            {
                headers: new HttpHeaders().set('ContentType', 'application/json').append('Content-Type', 'application/json'),
                params: new HttpParams().set('status', arg1)
            });
        return this.http.request(req);
    }
    getTables(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/restaurants/' + arg0 + '/tables');
        return this.http.request(req);
    }
    saveTable(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/restaurants/' + arg0 + '/tables', arg1);
        return this.http.request(req);
    }
    getTable(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/restaurants/' + arg0 + '/tables/' + arg1);
        return this.http.request(req);
    }
    updateTable(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/restaurants/' + arg0 + '/tables/' + arg1.id, arg1);
        return this.http.request(req);
    }
    deleteTable(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/restaurants/' + arg0 + '/tables/' + arg1);
        return this.http.request(req);
    }
    getOrders(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/restaurants/' + arg0 + '/orders',
            {
                params: new HttpParams().set('status', arg1)
            });
        return this.http.request(req);
    }
    saveOrder(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/orders', arg0);
        return this.http.request(req);
    }
    getOrder(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/orders/' + arg0);
        return this.http.request(req);
    }
    updateOrder(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/orders/' + arg0, arg1);
        return this.http.request(req);
    }
    orderStatus(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/orders/' + arg0, '' ,
            {
                headers: new HttpHeaders().set('ContentType', 'application/json').append('Content-Type', 'application/json'),
                params: new HttpParams().set('status', arg1)
            });
        return this.http.request(req);
    }
    deleteOrder(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/orders/' + arg0);
        return this.http.request(req);
    }
    getCategories(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/restaurants/' + arg0 + '/menuitemcategories');
        return this.http.request(req);
    }
    updateCategory(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menuitemcategories/' + arg0, arg1);
        return this.http.request(req);
    }
    saveCategory(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/menuitemcategories', arg0);
        return this.http.request(req);
    }
    getCategory(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menuitemcategories/' + arg0 );
        return this.http.request(req);
    }
    deleteCategory(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/menuitemcategories/' + arg0);
        return this.http.request(req);
    }
    postFile(arg0: any, arg1: any): any {
        const formdata: FormData = new FormData();
        formdata.append('file', arg0);
        const req = new HttpRequest('POST', this.baseUrl + '/storage/formfiles', formdata,
            {
                responseType: 'text',
                params: new HttpParams().set('prefix', arg1)
            }
    );
        return this.http.request(req);
    }
    getChoices(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menuitems/' + arg0 + '/menuitemchoices');
        return this.http.request(req);
    }
    saveChoice(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/menuitemchoices', arg0);
        return this.http.request(req);
    }
    updateChoice(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menuitemchoices/' + arg0, arg1);
        return this.http.request(req);
    }
    deleteChoice(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/menuitemchoices/' + arg0);
        return this.http.request(req);
    }
    getSizes(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menuitems/' + arg0 + '/menuitemsizes');
        return this.http.request(req);
    }
    saveSize(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/menuitemsizes', arg0);
        return this.http.request(req);
    }
    updateSize(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menuitemsizes/' + arg0, arg1);
        return this.http.request(req);
    }
    deleteSize(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/menuitemsizes/' + arg0);
        return this.http.request(req);
    }
    getOptions(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('GET', this.baseUrl + '/menuitemchoices/' + arg0 + '/menuitemoptions');
        return this.http.request(req);
    }
    saveOption(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/menuitemoptions', arg0);
        return this.http.request(req);
    }
    updateOption(arg0: any, arg1: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('PUT', this.baseUrl + '/menuitemoptions/' + arg0, arg1);
        return this.http.request(req);
    }
    deleteOption(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('DELETE', this.baseUrl + '/menuitemoptions/' + arg0);
        return this.http.request(req);
    }
    sendPaymentDetails(arg0: any): any {
        this.checkUserAccessToken();
        const req = new HttpRequest('POST', this.baseUrl + '/payment/charge', arg0);
        return this.http.request(req);
    }
    private checkUserAccessToken() {
        if (!this.isAccesTokenValid()) {
            this.updateAccessToken();
        }
    }
    private refreshToken() {
        const req = new HttpRequest('POST', this.oauthURL, '',
            { headers: this.headers, params: this.refrehTokenParams.append('refresh_token', this.user.refresh_token) });
        return this.http.request(req);
    }

    private isAccesTokenValid() {
        if ((this.user.expiryDate - (new Date().getTime()))  > 100) {
            return true;
        } else {
            return false;
        }
    }
    private updateAccessToken() {
        this.refreshToken().subscribe(
            (response) => {
                if (response instanceof HttpResponse) {
                    console.log('called refreshToken() ', response.body);
                    this.user.setUserTokenDetails(response);
                }
            },
            // tslint:disable-next-line:no-shadowed-variable
            (error) => {
                if (error instanceof HttpErrorResponse) {
                    console.log('Log out user ', error.error.error);
                    this.router.navigate(['']);
                }
            }
        );
    }


}
