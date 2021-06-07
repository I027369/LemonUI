import { SharedObject } from './../../shared/sharedObject.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAccount } from '../../shared/account.service';
import { BackendService } from '../../shared/backend.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Popup } from 'ng2-opd-popup';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { RestaurantDetails } from '../../shared/restaurant.service';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-menuitem',
  templateUrl: './menuitem.component.html',
  styleUrls: ['./menuitem.component.css']
})
export class MenuitemComponent implements OnInit {

  @ViewChild('imageInput')
  imageInputVariable: any;
  private restaurantId: any;
  menuItemList: any;
  menuItemCols: any[];
  menuItemLoadError: boolean;
  delSelectedMenuItem: any;
  displayAddMenuItem: boolean;
  msgs: Message[] = [];
  imageFile: any;
  fileToUpload: any;
  enablePublishButton: boolean;
  enableBlockButton: boolean;
  selMenuItem: any;

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

  menu = {
    id: '',
    name: null,
    availableFrom: '',
    availableTo: '',
    status: '',
    restaurantId: ''
  };

  categoryList: any;

  constructor(private backendService: BackendService, private user: UserAccount, private restaurant: RestaurantDetails,
    private activatedRoute: ActivatedRoute, private messageService: MessageService,
    private confirmationService: ConfirmationService, private shareObject: SharedObject,
    private router: Router) { }

  ngOnInit() {
   // console.log('in the menuitems ', this.activatedRoute.snapshot.params['id']);
    this.restaurantId = this.user.restaurantId;
    this.menuItemCols = [
      { field: 'name', header: 'Name' },
      { field: 'description', header: 'Description' },
      { field: 'categoryName', header: 'Category' },
      { field: 'price', header: 'Price' },
      { field: 'status', header: 'Status' }
    ];
    this.getMenuDetails();
    this.getMenuItemDetails();
  }

  getMenuDetails(): any {
    this.backendService.getMenu(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.menu = response.body;
            let event2 = new Date();
            const str = event2.toISOString().substring(0, 11);
            event2 = new Date(str + this.menu.availableFrom);
            this.menu.availableFrom = event2.toLocaleString('en-GB').substring(12, 17);
            event2 = new Date(str + this.menu.availableTo);
            this.menu.availableTo = event2.toLocaleString('en-GB').substring(12, 17);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu item details!');
          }
        }
      );
  }

  getMenuItemDetails(): any {
    this.backendService.getMenuItems(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.menuItemList = response.body;
            const arrayLength = this.menuItemList.length;
            for (let i = 0; i < arrayLength; i++) {
              if (this.menuItemList[i].image == null
                  || this.menuItemList[i].image === 'undefined'
                  || this.menuItemList[i].image.length < 1) {
                    this.menuItemList[i].image = '../../../../assets/img/fries.png';
                  }
              this.menuItemList[i].price = this.menuItemList[i].currency + this.menuItemList[i].price;
            }
           // console.log('getMenuItemDetails() ', this.menuItemList);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu item details!');
          }
        }
      );
  }

  openModalMenuItemPop() {
    this.getCategoryDetails();
    this.resetMenuItemDetails();
    this.displayAddMenuItem = true;
  }

  resetMenuItemDetails() {
    this.menuItem.id = '';
    this.menuItem.name = '';
    this.menuItem.description = '';
    this.menuItem.categoryId = '';
    this.menuItem.type = 'Vegetarian';
    this.menuItem.itemGroup = '';
    this.menuItem.price = '';
    this.menuItem.currency = this.restaurant.getRestaurantDetails().currency;
    this.menuItem.status = '';
    this.menuItem.restaurantId = '';
    this.menuItem.image = '',
    this.fileToUpload = null;
   // console.log(this.imageInputVariable.nativeElement.files);
    this.imageInputVariable.nativeElement.value = '';
  }

  addMenuItem() {
    console.log('Image >> ' + this.menuItem.image);
    if (this.fileToUpload != null ) {
      this.uploadFileToActivity();
    } else {
      this.insertMenuItem();
    }
  }

  insertMenuItem() {
    this.fileToUpload = null;
    this.menuItem.restaurantId = this.restaurantId;
    this.menuItem.menuId[0] = this.menu.id;
    if (this.menuItem.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateMenuItem(this.menuItem.id, this.menuItem));
    } else {
      this.callSubscibe(this.backendService.saveMenuItem(this.menuItem));
    }
  }

  selectFile(event) {
    this.fileToUpload = event.target.files[0];
  }

  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Menu item saved successully!');
          this.getMenuItemDetails();
          this.displayAddMenuItem = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          this.showMessage('error', 'Error Message', 'Could not save menu item!');
        }
      }
    );
  }

  editMenuItem(localMenuItem: any) {
    this.backendService.getMenuItem(localMenuItem.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.openModalMenuItemPop();
            this.menuItem = response.body;
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu item!');
          }
        }
      );

  }

  openDeleteMenuItemPop(selectedMenuItem: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteMenuItemData(selectedMenuItem);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteMenuItemData(selectedMenuItem: any) {
    this.backendService.deleteMenuItem(this.menu.id, selectedMenuItem.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
           // this.menuDeleted = true;
            this.getMenuItemDetails();
            this.showMessage('success', 'Success Message', 'Menu item deleted!');
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not delete menu item!');
          }
        }
      );
  }

  getCategoryDetails(): any {
    this.backendService.getCategories(this.user.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.categoryList = response.body;
            if (this.categoryList != null || this.categoryList === 'undefined') {
              this.menuItem.categoryId = this.categoryList[0].id;
            }
            // console.log('menuList ', this.menuList);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load table details!');
          }
        }
      );
  }
  uploadFileToActivity() {
    this.backendService.postFile(this.fileToUpload, this.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.menuItem.image = response.body;
            this.insertMenuItem();
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not upload image file!');
          }
        }
      );

  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }


  onRowSelect(event) {
    this.selMenuItem = event.data;
    this.setButtonStatus();
  }
  onRowUnSelect(event) {
    this.selMenuItem = null;
    this.enablePublishButton = false;
    this.enableBlockButton = false;
  }

  publishMenuItem() {
    this.confirmationService.confirm({
      message: 'Do you want to publish this record?',
      header: 'Publish Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        // this.deleteMenuData();
        this.changeMenuItemStatus('Published');
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  blockMenuItem() {
    this.confirmationService.confirm({
      message: 'Do you want to block this record?',
      header: 'Block Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        // this.deleteMenuData();
        this.changeMenuItemStatus('Blocked');
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  setButtonStatus() {
    if (this.selMenuItem != null || this.selMenuItem === 'undefined') {
      const arrayLength = this.menuItemList.length;
      for (let i = 0; i < arrayLength; i++) {
        if (this.menuItemList[i].id === this.selMenuItem.id) {
          this.selMenuItem = this.menuItemList[i];
          break;
        }
      }
      if (this.selMenuItem.status === 'Draft' || this.selMenuItem.status === 'Blocked') {
        this.enablePublishButton = true;
        this.enableBlockButton = false;
      } else if (this.selMenuItem.status === 'Published') {
        this.enableBlockButton = true;
        this.enablePublishButton = false;
      }
    }
  }

  changeMenuItemStatus(status: string) {
    this.backendService.updateMenuItemStatus(this.selMenuItem.id, status)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getMenuItemDetails();
            this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Record updated' }];
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.setButtonStatus();
            this.msgs = [{ severity: 'error', summary: 'Error Message', detail: 'Could not update record' }];
          }
        }
      );
  }

  showChoiceSizes(localMenuItem: any) {
    this.shareObject.menuItem = localMenuItem;
    this.router.navigate(['/home/menu/' + this.activatedRoute.snapshot.params['id'] + '/menuitem/' + localMenuItem.id]);
  }
}
