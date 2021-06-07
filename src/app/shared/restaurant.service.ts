import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class RestaurantDetails {

    restaurant = {
        id: 0,
        name: '',
        website: '',
        phone: 0,
        emailId: '',
        tags: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        backgroundColor: '',
        backgroundImage: '',
        currency: '',
        logo: '',
        qrLogo: '',
        status: '',
        tagLine: '',
        taxPercentage: 0.0,
        stripePublishKey: '',
        stripeSecretKey: ''
    };

    public setRestaurantDetails(response: HttpResponse<any>) {
      this.restaurant = response.body;
    }
    public getRestaurantDetails() {
        return this.restaurant;
    }
}
