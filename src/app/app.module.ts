import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TablesComponent } from './tables/tables.component';
import { NewTableComponent } from './new-table/new-table.component';
import { UserComponent } from './user/user.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { TableViewComponent } from './table-view/table-view.component';
import { SystemInfoComponent } from './system-info/system-info.component';

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
    SystemInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
