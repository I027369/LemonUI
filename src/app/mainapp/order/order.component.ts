import { BackendService } from './../../shared/backend.service';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserAccount } from '../../shared/account.service';
import { Popup } from 'ng2-opd-popup';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RestaurantDetails } from '../../shared/restaurant.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {


  orderList: any;
  private restaurantId: any;
  msgs: Message[] = [];

  paymentRequest = {
    token: '',
    amount: 0.0,
    currency: '',
    email: '',
    appUserId: '',
    orderId: 0
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private popup: Popup, private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService, private restDetails: RestaurantDetails) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.openCity(null, null);
  }
  getNewOrderDetails(arg0: any): any {
    this.backendService.getOrders(this.user.restaurantId, arg0)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.orderList = response.body;
            const arrayLength = this.orderList.length;
            for (let i = 0; i < arrayLength; i++) {
              this.orderList[i].orderDate = new Date(this.orderList[i].timestamp).toLocaleDateString() + ' ' +
                                            new Date(this.orderList[i].timestamp).toLocaleTimeString();
              if (this.orderList[i].message === null || this.orderList[i].message === 'undefined' ) {
                this.orderList[i].hasMessage = false;
              } else {
                this.orderList[i].hasMessage = true;
              }
              this.orderList[i].totalAmountWithCurrency = this.orderList[i].currency + this.orderList[i].totalAmount;
              const itemLength = this.orderList[i].orderItem.length;
              for (let j = 0; j < itemLength; j++) {
                this.orderList[i].orderItem[j].priceWithCurrency = this.orderList[i].orderItem[j].currency
                                                                   + this.orderList[i].orderItem[j].price;
              }
            }
            // console.log('menuList ', this.menuList);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load order details!');
          }
        }
      );
  }


  showOrderItems(order: any) {
    // console.log('in the show menu ', order);
    this.router.navigate(['/home/order/' + order.id]);
  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }

  openCity(evt, cityName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    if (cityName != null) {
      document.getElementById(cityName).style.display = 'block';
      if (cityName === 'New Orders') {
        this.getNewOrderDetails('New');
      }
      if (cityName === 'Ongoing Orders') {
        this.getNewOrderDetails('In-Process');
      }
      if (cityName === 'Finished Orders') {
        this.getNewOrderDetails('Finished');
      }
    } else {
      document.getElementById('New Orders').style.display = 'block';
      this.getNewOrderDetails('New');
    }
    if (evt != null) {
      evt.currentTarget.className += ' active';
    } else {
      document.getElementById('defaultOpen').className += ' active';
    }
  }

  setOrderStatusAndRetreive(localId: any, localStatus: any, retrieveStatus: any) {
    this.backendService.orderStatus(localId, localStatus)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getNewOrderDetails(retrieveStatus);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not save order!');
          }
        }
      );
  }

  acceptOrder(localOrder: any) {
    this.setOrderStatusAndRetreive(localOrder.id, 'In-Process', 'New');
  }

  cancelOrder(localOrder: any) {
    this.setOrderStatusAndRetreive(localOrder.id, 'Cancel', 'New');
  }

  selectStatus(localStatus: any, localOrder: any) {
    console.log('inside selectStatus ', localStatus, localOrder);
    if (localStatus.target.value === 'Completed') {
      this.setOrderStatusAndRetreive(localOrder.id, 'Completed', 'In-Process');
    }
    if (localStatus.target.value === 'In-Process') {
      this.setOrderStatusAndRetreive(localOrder.id, 'In-Process', 'In-Process');
    }
    if (localStatus.target.value === 'Canceled') {
      this.confirmCancel(localStatus, localOrder);
    }

  }

  confirmCancel(localStatus: any, localOrder: any) {
    this.confirmationService.confirm({
      message: 'Do you want to cancel the order?',
      header: 'Cancel Confirmation',
      icon: 'fa fa-thumbs-o-down',
      accept: () => {
        this.setOrderStatusAndRetreive(localOrder.id, 'Canceled', 'In-Process');
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  openCheckout(localOrder: any) {
      const self = this;
      if (self.restDetails.getRestaurantDetails().stripePublishKey == null
          || self.restDetails.getRestaurantDetails().stripePublishKey === 'undefined'
          || self.restDetails.getRestaurantDetails().stripePublishKey.length < 1) {
            self.showMessage('error', 'Error Message', 'Setup Stripe payment information in restaurant setting!');
            return;
          }
      const handler = (<any>window).StripeCheckout.configure({
      key: self.restDetails.getRestaurantDetails().stripePublishKey,
      locale: 'auto',
      token: function (token: any) {
        console.log('second in the openCheckout', token);
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        self.paymentRequest.token = token.id;
        self.paymentRequest.amount = localOrder.totalAmount;
        self.paymentRequest.orderId = localOrder.id;
        self.paymentRequest.appUserId = self.user.id;
        self.paymentRequest.email = self.user.emailId;
        self.backendService.sendPaymentDetails(self.paymentRequest)
          .subscribe(
            (response) => {
              if (response instanceof HttpResponse) {
                self.showMessage('success', 'Success Message', 'Payment is successful!');
                self.setOrderStatusAndRetreive(localOrder.id, 'Finished', 'In-Process');
              }
            },
            (error) => {
              if (error instanceof HttpErrorResponse) {
                self.showMessage('error', 'Error Message', 'Payment is not successful!');
              }
            }
          );
      }
    });

    handler.open({
      name: self.restDetails.getRestaurantDetails().name,
      description: 'Pay by Credit/Debit Card',
      amount: localOrder.totalAmount * 100
    });

  }
}
