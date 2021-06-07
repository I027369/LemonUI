import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../shared/backend.service';
import { UserAccount } from '../../shared/account.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { Message } from 'primeng/api';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryList: any;
  private restaurantId: any;
  msgs: Message[] = [];
  categoryCols: any[];
  displayCategory: boolean;

  category = {
    id: '',
    name: null,
    sortOrder: '',
    restaurantId: ''
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.categoryCols = [
      { field: 'name', header: 'Name' },
      { field: 'sortOrder', header: 'Order' }
    ];
    this.getCategoryDetails();
  }



  getCategoryDetails(): any {
    this.backendService.getCategories(this.user.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.categoryList = response.body;
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


  addCategory() {
    this.category.restaurantId = this.restaurantId;
    if (this.category.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateCategory(this.category.id, this.category));
    } else {
      this.callSubscibe(this.backendService.saveCategory(this.category));
    }
  }
  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Category data saved successfully!');
          this.getCategoryDetails();
          this.displayCategory = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('Processing http error', error.error.error);
          this.showMessage('error', 'Error Message', 'Could not save category data!');
        }
      }
    );
  }

  editCategory(cat: any) {
    // console.log('in the edit menu ', menu);
    this.resetCategoryDetails();
    this.backendService.getCategory(cat.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.category = response.body;
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load menu details!');
          }
        }
      );
    this.displayCategory = true;
  }

  openDeleteCategoryPop(cat: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteCategoryData(cat);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

  deleteCategoryData(cat: any) {
    this.backendService.deleteCategory(cat.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getCategoryDetails();
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

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }

  showDialog() {
    this.resetCategoryDetails();
    this.displayCategory = true;
  }

  resetCategoryDetails() {
    this.category.id = '';
    this.category.name = null;
    this.category.sortOrder = '';
  }
}
