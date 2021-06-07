import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class UserAccount {
    public id: string;
    public emailId: string;
    public name: string;
    public role: string;
    public company: string;
    public phone: string;
    public restaurantId: string;
    public access_token: string;
    public refresh_token: string;
    public scope: string;
    public token_type: string;
    public expires_in: number;
    public expiryDate: number;

    public setUserDetails(response: HttpResponse<any>) {
        this.id = response.body.id;
        this.emailId = response.body.emailId;
        this.name = response.body.name;
        this.role = response.body.role;
        this.company = response.body.company;
        this.phone = response.body.phone;
        this.restaurantId = response.body.restaurant.id;
    }

    public setUserTokenDetails(response: HttpResponse<any>) {
        this.access_token = response.body.access_token;
        this.refresh_token = response.body.refresh_token;
        this.expires_in = response.body.expires_in;
        this.scope = response.body.scope;
        this.token_type = response.body.token_type;
        this.setAccessTokenExpiry();
    }

    private setAccessTokenExpiry() {
        this.expiryDate = new Date().getTime() + (1000 * this.expires_in);
    }
}
