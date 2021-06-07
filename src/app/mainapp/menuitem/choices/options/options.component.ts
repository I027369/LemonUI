import { Component, OnInit } from '@angular/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BackendService } from '../../../../shared/backend.service';
import { UserAccount } from '../../../../shared/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { SharedObject } from '../../../../shared/sharedObject.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RestaurantDetails } from '../../../../shared/restaurant.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  private restaurantId: any;
  msgs: Message[] = [];
  optionCols: any[];
  optionList: any;
  displayOption: boolean;
  choiceId: any;

  menuItem = {
    id: '',
    name: '',
    description: '',
    categoryId: '',
    categoryName: '',
    type: '',
    itemGroup: '',
    status: '',
    price: '',
    currency: '',
    restaurantId: '',
    image: '',
    menuId: []
  };

  choice = {
    id: null,
    name: null,
    required: false,
    detail: null,
    menuItemId: null
  };

  option = {
    id: null,
    name: null,
    description: null,
    price: 0.0,
    currency: '',
    menuItemChoiceId: ''
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute,
    private shareObject: SharedObject, private restaurant: RestaurantDetails) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.optionCols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'priceWithCurrency', header: 'Price' }
    ];
    this.choiceId = this.activatedRoute.snapshot.params['choiceid'];
    this.getOptionDetails();
    this.menuItem = this.shareObject.menuItem;
    this.choice = this.shareObject.choice;
  }

  getOptionDetails() {
    this.backendService.getOptions(this.choiceId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.optionList = response.body;
            const arrayLength = this.optionList.length;
            for (let i = 0; i < arrayLength; i++) {
              this.optionList[i].priceWithCurrency = this.optionList[i].currency + this.optionList[i].price;
            }
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load option details!');
          }
        }
      );
  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }
  openModalOptionPop() {
    this.resetOptionDetails();
    this.displayOption = true;
  }

  resetOptionDetails() {
    this.option.id = null;
    this.option.name = null;
    this.option.description = null;
    this.option.price = 0.0;
    this.option.currency = this.restaurant.getRestaurantDetails().currency;
    this.option.menuItemChoiceId = this.choiceId;
  }

  addOption() {
    this.option.menuItemChoiceId = this.choiceId;
    if (this.option.id != null && this.option.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateOption(this.option.id, this.option));
    } else {
      this.callSubscibe(this.backendService.saveOption(this.option));
    }
  }

  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Option saved successfully!');
          this.getOptionDetails();
          this.displayOption = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('Processing http error', error.error.error);
          this.showMessage('error', 'Error Message', 'Could not save option!');
        }
      }
    );
  }

  editOption(localOption: any) {
    this.option = localOption;
    this.displayOption = true;
  }

  openDeleteOptionPop(localOption: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteOptionData(localOption);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteOptionData(localOption: any) {
    this.backendService.deleteOption(localOption.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getOptionDetails();
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
