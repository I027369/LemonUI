import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../../shared/backend.service';
import { UserAccount } from '../../shared/account.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Popup } from 'ng2-opd-popup';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuList: any;
  selMenu: any;
  private restaurantId: any;
  menuCols: any[];
  msgs: Message[] = [];
  displayAddMenu: boolean;
  enablePublishButton: boolean;
  enableBlockButton: boolean;
  availFrom = new Date();
  availTo = new Date();
  view_tab: any;

  menu = {
    id: '',
    name: null,
    availableFrom : '' ,
    availableTo: '',
    status: 'Active',
    restaurantId: ''
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private popup: Popup, private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.menuCols = [
      { field: 'name', header: 'Name' },
      { field: 'availableFrom', header: 'Available From' },
      { field: 'availableTo', header: 'Available To' },
      { field: 'status', header: 'Status' }
    ];
    this.getMenuDetails();
    this.openCity(null, null);
  }


  private getMenuDetails() {
    this.backendService.getMenus(this.user.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.menuList = response.body;

            let event2 = new Date();
            let str = '';
            const arrayLength = this.menuList.length;
            for (let i = 0; i < arrayLength; i++) {
              str = event2.toISOString().substring(0, 11);
              event2 = new Date(str + this.menuList[i].availableFrom);
              this.menuList[i].availableFrom = event2.toLocaleString('en-GB').substring(12, 17);

              event2 = new Date(str + this.menuList[i].availableTo);
              this.menuList[i].availableTo = event2.toLocaleString('en-GB').substring(12, 17);

            }
            this.setButtonStatus();
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu details!');
          }
        }
      );
  }


  addMenu() {
    this.menu.restaurantId = this.restaurantId;
    if (this.checkDates()) {
      this.showMessage('error', 'Error Message', 'From time can not be later than To time');
      return;
    }
    this.formatTime();
    if (this.menu.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateMenu(this.menu.id, this.menu));
    } else {
      this.callSubscibe(this.backendService.saveMenu(this.menu));
    }
  }
  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Menu saved successfully!');
          this.getMenuDetails();
          this.displayAddMenu = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('Processing http error', error.error.error);
          this.showMessage('error', 'Error Message', 'Could not save menu!');
        }
      }
    );
  }


  editMenu(menu: any) {
    // console.log('in the edit menu ', menu);
    this.resetMenuDetails();
    this.menu = menu;
    this.setMenuDetails (null);
 /*   this.backendService.getMenu(menu.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.setMenuDetails(response);
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu details!');
          }
        }
      );
    */
    this.displayAddMenu = true;
  }

  openDeleteMenuPop(selectedMenu: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteMenuData(selectedMenu);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteMenuData(selectedMenu: any) {
    this.backendService.deleteMenu(selectedMenu.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getMenuDetails();
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

  public setMenuDetails(response: HttpResponse<any>) {
   // this.menu = response.body;

    const event2 = new Date();
    let str = '';
    str = event2.toISOString().substring(0, 11);
    this.availFrom = new Date(str + this.menu.availableFrom);
    this.availTo = new Date(str + this.menu.availableTo);

  }

  resetMenuDetails() {
    this.menu.id = '';
    this.menu.name = null;
    this.availFrom = new Date();
    this.availTo = new Date();
    this.menu.status = 'Draft';
    this.menu.restaurantId = '';
  }
  showMenuItems(menu: any) {
    this.router.navigate(['/home/menu/' + menu.id]);
  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }

  showDialog() {
    this.resetMenuDetails();
    this.displayAddMenu = true;
  }

  formatTime() {
    this.menu.availableFrom = this.availFrom.toISOString().substr(11);
    this.menu.availableTo = this.availTo.toISOString().substr(11);
  }
  checkDates() {
    if ( this.availFrom.getTime() > this.availTo.getTime() ) {
      return true;
    } else {
      return false;
    }

  }

  onRowSelect(event) {
    this.selMenu = event.data;
    this.setButtonStatus();
  }
  onRowUnSelect(event) {
    this.selMenu = null;
    this.enablePublishButton = false;
    this.enableBlockButton = false;
  }

  publishMenu() {
    this.confirmationService.confirm({
      message: 'Do you want to publish this record?',
      header: 'Publish Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        // this.deleteMenuData();
        this.changeMenuStatus('Published');
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  blockMenu() {
    this.confirmationService.confirm({
      message: 'Do you want to block this record?',
      header: 'Block Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        // this.deleteMenuData();
        this.changeMenuStatus('Blocked');
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  setButtonStatus() {
    if (this.selMenu != null || this.selMenu === 'undefined') {
      const arrayLength = this.menuList.length;
      for (let i = 0; i < arrayLength; i++) {
        if (this.menuList[i].id === this.selMenu.id) {
          this.selMenu = this.menuList[i];
          break;
        }
      }
      if (this.selMenu.status === 'Draft' || this.selMenu.status === 'Blocked') {
        this.enablePublishButton = true;
        this.enableBlockButton = false;
      } else if (this.selMenu.status === 'Published') {
        this.enableBlockButton = true;
        this.enablePublishButton = false;
      }
    }
  }

  changeMenuStatus(status: string) {
    this.backendService.updateMenuStatus(this.selMenu.id, status)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getMenuDetails();
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
    } else {
      document.getElementById('Menu').style.display = 'block';
    }
    if (evt != null) {
      evt.currentTarget.className += ' active';
    } else {
      document.getElementById('defaultOpen').className += ' active';
    }
  }

}
