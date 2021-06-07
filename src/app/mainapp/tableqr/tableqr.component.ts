import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../shared/backend.service';
import { UserAccount } from '../../shared/account.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Message } from 'primeng/components/common/api';
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-tableqr',
  templateUrl: './tableqr.component.html',
  styleUrls: ['./tableqr.component.css']
})
export class TableqrComponent implements OnInit {
  restaurantId: any;
  msgs: Message[] = [];
  tableList: any;
  constructor(private backendService: BackendService, private user: UserAccount,
    private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    this.restaurantId = this.user.restaurantId;
    this.getTableDetails();
  }
  getTableDetails(): any {
    this.backendService.getTables(this.user.restaurantId)
      .subscribe(
        (response) => {
          if (response instanceof HttpResponse) {
            this.tableList = response.body;
            const arrayLength = this.tableList.length;
            for (let i = 0; i < arrayLength; i++) {
              this.tableList[i].qrCode = this.restaurantId + ';' + this.tableList[i].tableId;
              if (response.body[i].description === '') {
                  this.tableList[i].description = 'Table Description';
                }
            }
          }
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            this.showMessage('error', 'Error Message', 'Could not load table details!');
          }
        }
      );
  }

  showMessage(sev: any, sum: any, det: any) {
    this.msgs = [];
    this.msgs.push({ severity: sev, summary: sum, detail: det });
  }
  savePDF() {
    const element = document.getElementById('element-to-print');
    html2pdf(element, {
      margin: 1,
      filename: 'TableQR.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    });
  }
}
