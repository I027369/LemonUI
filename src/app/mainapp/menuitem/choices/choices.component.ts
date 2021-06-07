import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Message, ConfirmationService } from 'primeng/api';
import { BackendService } from '../../../shared/backend.service';
import { UserAccount } from '../../../shared/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { SharedObject } from '../../../shared/sharedObject.service';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.css']
})
export class ChoicesComponent implements OnInit {

  choiceList: any;
  private restaurantId: any;
  msgs: Message[] = [];
  choiceCols: any[];
  displayChoice: boolean;
  menuItemId = null;

  choice = {
    id: null,
    name: null,
    required: false,
    detail: null,
    menuItemId: null
  };

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

  constructor(private backendService: BackendService, private user: UserAccount,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute,
    private shareObject: SharedObject) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.choiceCols = [
      { field: 'name', header: 'Name' },
      { field: 'detail', header: 'Description' },
      { field: 'required', header: 'Required' }
    ];
    this.menuItemId = this.activatedRoute.snapshot.params['itemid'];
    this.getChoiceDetails();
    this.menuItem = this.shareObject.menuItem;
  }

  getChoiceDetails() {
    this.backendService.getChoices(this.activatedRoute.snapshot.params['itemid'])
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.choiceList = response.body;
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
    this.resetChoiceDetails();
    this.displayChoice = true;
  }

  resetChoiceDetails() {
    this.choice.id = null;
    this.choice.name = null;
    this.choice.detail = null;
    this.choice.required = false;
    this.choice.menuItemId = this.menuItemId;
  }

  addChoice() {
    this.choice.menuItemId = this.menuItemId;
    if (this.choice.required.toString() === 'true') {
      this.choice.required = true;
    } else {
      this.choice.required = false;
    }
    if (this.choice.id != null && this.choice.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateChoice(this.choice.id, this.choice));
    } else {
      this.callSubscibe(this.backendService.saveChoice(this.choice));
    }
  }

  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Choice saved successfully!');
          this.getChoiceDetails();
          this.displayChoice = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('Processing http error', error.error.error);
          this.showMessage('error', 'Error Message', 'Could not save choice!');
        }
      }
    );
  }

  editChoice(localChoice: any) {
    this.choice = localChoice;
    this.displayChoice = true;
  }

  openDeleteChoicePop(selectedChoice: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteChoiceData(selectedChoice);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteChoiceData(selectedChoice: any) {
    this.backendService.deleteChoice(selectedChoice.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getChoiceDetails();
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

  showOptions(localChoice: any) {
    this.shareObject.choice = localChoice;
    this.router.navigate(['/home/menu/' + this.activatedRoute.snapshot.params['id']
    + '/menuitem/' + this.menuItemId + '/choice/' + localChoice.id]);
  }

}
