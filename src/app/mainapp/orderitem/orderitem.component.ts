import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../shared/backend.service';
import { UserAccount } from '../../shared/account.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-orderitem',
  templateUrl: './orderitem.component.html',
  styleUrls: ['./orderitem.component.css']
})
export class OrderitemComponent implements OnInit {

  order = {
    id: '',
    table: '',
    user: '',
    status: ''
  };

  constructor(private backendService: BackendService, private user: UserAccount,
    private activatedRoute: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit() {
  }

}
