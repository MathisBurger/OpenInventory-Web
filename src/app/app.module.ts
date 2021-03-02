import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { LoginComponent } from './routes/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TablesComponent } from './routes/tables/tables.component';
import { NewTableComponent } from './routes/new-table/new-table.component';
import { UserComponent } from './routes/user/user.component';
import { PermissionsComponent } from './routes/permissions/permissions.component';
import { TableViewComponent } from './routes/table-view/table-view.component';
import { SystemInfoComponent } from './routes/system-info/system-info.component';
import {RestAPIService} from "./services/rest-api.service";
import {HttpClientModule} from "@angular/common/http";
import { PopupWindowComponent } from './components/popup-window/popup-window.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    TablesComponent,
    NewTableComponent,
    UserComponent,
    PermissionsComponent,
    TableViewComponent,
    SystemInfoComponent,
    PopupWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: 'RestAPIService',
      useClass: RestAPIService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
