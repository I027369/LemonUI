import { Component, OnInit } from '@angular/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BackendService } from '../../../shared/backend.service';
import { UserAccount } from '../../../shared/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RestaurantDetails } from '../../../shared/restaurant.service';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.css']
})
export class SizesComponent implements OnInit {

  sizeList: any;
  private restaurantId: any;
  msgs: Message[] = [];
  sizeCols: any[];
  displaySize: boolean;
  menuItemId: null;

  size = {
    id: '',
    name: null,
    description: '',
    price: 0.0,
    currency: '',
    combinedPrice: '',
    menuItemId: ''
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private router: Router, private messageService: MessageService, private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService, private restaurant: RestaurantDetails) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.sizeCols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'combinedPrice', header: 'Price  ' }
    ];
    this.menuItemId = this.activatedRoute.snapshot.params['itemid'];
    this.getSizeDetails();
  }
  getSizeDetails() {
    this.backendService.getSizes(this.activatedRoute.snapshot.params['itemid'])
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.sizeList = response.body;
            const arrayLength = this.sizeList.length;
            for (let i = 0; i < arrayLength; i++) {
              this.sizeList[i].combinedPrice = this.sizeList[i].currency + this.sizeList[i].price;
            }
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu details!');
          }
        }
      );
  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }

  showDialog() {
    this.resetSizeDetails();
    this.displaySize = true;
  }

  resetSizeDetails() {
    this.size.id = null;
    this.size.name = null;
    this.size.description = null;
    this.size.price = 0.0;
    this.size.currency = this.restaurant.getRestaurantDetails().currency;
    this.size.menuItemId = null;
  }

  addSize() {
    this.size.menuItemId = this.menuItemId;
    if (this.size.id != null && this.size.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateSize(this.size.id, this.size));
    } else {
      this.callSubscibe(this.backendService.saveSize(this.size));
    }
  }

  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Size saved successfully!');
          this.getSizeDetails();
          this.displaySize = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('Processing http error', error.error.error);
          this.showMessage('error', 'Error Message', 'Could not save size!');
        }
      }
    );
  }

  editSize(localSize: any) {
    this.size = localSize;
    this.displaySize = true;
  }

  openDeleteSizePop(selectedSize: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteSizeData(selectedSize);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteSizeData(selectedSize: any) {
    this.backendService.deleteSize(selectedSize.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getSizeDetails();
            this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }];
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.msgs = [{ severity: 'error', summary: 'Error Message', detail: 'Could not delete record' }];
          }
        }
      );
  }

}
