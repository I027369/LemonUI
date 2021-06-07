import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BackendService } from '../../shared/backend.service';
import { UserAccount } from '../../shared/account.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { RestaurantDetails } from '../../shared/restaurant.service';


interface Status {
  name: string;
  code: string;
}

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restaurantId: any;
  msgs: Message[] = [];
  statuses: Status[];
  selectedStatus: Status;
  color: string;
  logoToUpload: any;
  qrlogoToUpload: any;
  bgToUpload: any;

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


  @ViewChild('f') loginForm: NgForm;

  constructor(private backendService: BackendService, private user: UserAccount,
    private restDetails: RestaurantDetails,
    private messageService: MessageService) {
    this.statuses = [
      { name: 'Draft', code: 'D' },
      { name: 'Published', code: 'P' },
      { name: 'Blocked', code: 'B' }
    ];

    }

  ngOnInit() {
    this.restaurant = this.restDetails.getRestaurantDetails();
    this.restaurantId = this.user.restaurantId;
  }

  public setRestaurantDetails(response: HttpResponse<any>) {
    this.restaurant = response.body;
  }


  onSubmit() {
    this.uploadImageFile();
    this.backendService.saveRestaurant(this.restaurantId, this.restaurant)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.restDetails.setRestaurantDetails(response);
            this.showMessage('success', 'Success Message', 'Restaurant data saved successfully!');
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            // console.log('Processing http error', error.error.error);
            this.showMessage('error', 'Error Message', 'Could not save restaurant data!');
          }
        }
      );
  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }

  selectLogoFile(event) {
    this.logoToUpload = event.target.files[0];
  }
  selectBGImageFile(event) {
    this.bgToUpload = event.target.files[0];
  }
  selectQRLogoFile(event) {
    this.qrlogoToUpload = event.target.files[0];
  }

  uploadImageFile() {
    if (this.logoToUpload != null) {
      this.uploadFileToActivity(this.logoToUpload, 1, 'Could not upload logo image file!');
    }
    if (this.bgToUpload != null) {
      this.uploadFileToActivity(this.bgToUpload, 2, 'Could not upload background image file!');
    }
    if (this.qrlogoToUpload != null) {
      this.uploadFileToActivity(this.qrlogoToUpload, 3, 'Could not upload QR logo file!');
    }
  }

  uploadFileToActivity(logoToUpload: any, imageType: number, errorString: string) {
    this.backendService.postFile(this.logoToUpload, this.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            if (imageType === 1) {
              this.restaurant.logo = response.body;
            }
            if (imageType === 2) {
              this.restaurant.backgroundImage = response.body;
            }
            if (imageType === 3) {
              this.restaurant.qrLogo = response.body;
            }
            this.saveRestaurantData();
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', errorString);
          }
        }
      );
  }

  saveRestaurantData() {
    this.backendService.saveRestaurant(this.restaurantId, this.restaurant)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.restDetails.setRestaurantDetails(response);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
          }
        }
      );
  }

}
