import { HttpModule } from '@angular/Http';
import { BackendService } from './shared/backend.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PopupModule } from 'ng2-opd-popup';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GrowlModule } from 'primeng/growl';
import { MessageService } from 'primeng/components/common/messageservice';
import { QRCodeModule } from 'angularx-qrcode';
import { DialogModule } from 'primeng/dialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BackendServiceInterceptor } from './shared/backendservice.interceptor';
import { UserAccount } from './shared/account.service';
import { Routes, RouterModule } from '@angular/router';
import { SuccessfulComponent } from './signup/successful/successful.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './mainapp/navbar/navbar.component';
import { RestaurantComponent } from './mainapp/restaurant/restaurant.component';
import { MenuComponent } from './mainapp/menu/menu.component';
import { MenuitemComponent } from './mainapp/menuitem/menuitem.component';
import { TableComponent } from './mainapp/table/table.component';
import { TableqrComponent } from './mainapp/tableqr/tableqr.component';
import { OrderComponent } from './mainapp/order/order.component';
import { OrderitemComponent } from './mainapp/orderitem/orderitem.component';
import { LandingComponent } from './landing/landing.component';
import { FooterComponent } from './mainapp/footer/footer.component';
import { RestaurantDetails } from './shared/restaurant.service';
import { CategoryComponent } from './mainapp/category/category.component';
import { ChoicesComponent } from './mainapp/menuitem/choices/choices.component';
import { SizesComponent } from './mainapp/menuitem/sizes/sizes.component';
import { SharedObject } from './shared/sharedObject.service';
import { OptionsComponent } from './mainapp/menuitem/choices/options/options.component';



const appRoutes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/successful', component: SuccessfulComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/restaurant', component: RestaurantComponent },
  { path: 'home/menu', component: MenuComponent },
  { path: 'home/menu/:id', component: MenuitemComponent },
  { path: 'home/table', component: TableComponent },
  { path: 'home/table/tableqr', component: TableqrComponent },
  { path: 'home/order', component: OrderComponent },
  { path: 'home/order/:id', component: OrderitemComponent },
  { path: 'home/category', component: CategoryComponent },
  { path: 'home/menu/:id/menuitem/:itemid', component: ChoicesComponent },
  { path: 'home/menu/:id/menuitem/:itemid/choice/:choiceid', component: OptionsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SuccessfulComponent,
    HomeComponent,
    NavbarComponent,
    RestaurantComponent,
    MenuComponent,
    MenuitemComponent,
    TableComponent,
    TableqrComponent,
    OrderComponent,
    OrderitemComponent,
    LandingComponent,
    FooterComponent,
    CategoryComponent,
    ChoicesComponent,
    SizesComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    PopupModule.forRoot(),
    ButtonModule,
    TableModule,
    MenubarModule,
    FieldsetModule,
    BrowserAnimationsModule,
    GrowlModule,
    QRCodeModule,
    DialogModule,
    ColorPickerModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    TabViewModule,
    CalendarModule,
    ConfirmDialogModule

  ],
  providers: [BackendService, UserAccount, MessageService, RestaurantDetails, ConfirmationService, SharedObject,
    { provide: HTTP_INTERCEPTORS, useClass: BackendServiceInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
