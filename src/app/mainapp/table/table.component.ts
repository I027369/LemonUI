import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../../shared/backend.service';
import { UserAccount } from '../../shared/account.service';
import { Popup } from 'ng2-opd-popup';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private restaurantId: any;
  msgs: Message[] = [];
  tableCols: any[];
  tableList: any;
  delSelectedTable: any;
  displayTable: boolean;


  table = {
    id: '',
    tableId: null,
    description: ''
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private router: Router, private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.tableCols = [
      { field: 'tableId', header: 'Table Id' },
      { field: 'description', header: 'Description' }
    ];
    this.getTableDetails();
  }
  getTableDetails(): any {
    this.backendService.getTables(this.user.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.tableList = response.body;
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

  resetTableDetails() {
    this.table.id = '';
    this.table.tableId = null;
    this.table.description = '';
  }
  addTable() {
    if (this.table.id.toString().length > 0) {
      this.callSubscibe(this.backendService.updateTable(this.restaurantId, this.table));
    } else {
      this.callSubscibe(this.backendService.saveTable(this.restaurantId, this.table));
    }
  }
  callSubscibe(request: any) {
    request.subscribe(
      (response) => {
        if (response instanceof HttpResponse) {
          this.showMessage('success', 'Success Message', 'Table data saved successfully!');
          this.getTableDetails();
          this.displayTable = false;
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          // console.log('Processing http error', error.error.error);
          this.showMessage('error', 'Error Message', 'Could not save table data!');
        }
      }
    );
  }

  editTable(table: any) {
    this.backendService.getTable(this.restaurantId, table.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.table = response.body;
            this.displayTable = true;
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load table details!');
          }
        }
      );
}

  deleteTableData(selTable: any) {
    this.backendService.deleteTable(this.restaurantId, selTable.id)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.getTableDetails();
            this.showMessage('success', 'Success Message', 'Table deleted successfully!');
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not delete table!');
          }
        }
      );
  }

  generateQR() {
    this.router.navigate(['/home/table/tableqr']);
  }
  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }

  showDialog() {
    this.resetTableDetails();
    this.displayTable = true;
  }

  openDeleteTablePop(selTable: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.deleteTableData(selTable);
      },
      reject: () => {
        this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }

}
