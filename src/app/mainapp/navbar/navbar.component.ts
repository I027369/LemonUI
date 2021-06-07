import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { RestaurantDetails } from '../../shared/restaurant.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  restaurantName: string;
  tagline: string;
  items: MenuItem[];
  logo: string;

  constructor(private restDetails: RestaurantDetails) { }

  ngOnInit() {
    this.restaurantName = this.restDetails.getRestaurantDetails().name;
    this.tagline = this.restDetails.getRestaurantDetails().tagLine;
    this.logo = this.restDetails.getRestaurantDetails().logo;
    this.items = [
      {
        label: 'Home',
        icon: 'fa fa-fw fa-home', routerLink: ['/home']
      },
      {
        label: 'Restaurant',
        icon: 'fa fa-fw fa-info-circle', routerLink: ['/home/restaurant']
      },
      {
        label: 'Menu',
        icon: 'fa fa-fw fa-cutlery', routerLink: ['/home/menu']
      },
      {
        label: 'Tables',
        icon: 'fa fa-fw fa-table', routerLink: ['/home/table']
      },
      {
        label: 'Orders',
        icon: 'fa fa-fw fa-ship', routerLink: ['/home/order']
      },
      {
        label: 'Offers',
        icon: 'fa fa-fw fa-gift'
      },
      {
        label: 'Reports',
        icon: 'fa fa-fw fa-bar-chart'
      }
    ];
  }


}
