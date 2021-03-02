import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './routes/dashboard/dashboard.component';
import {LoginComponent} from './routes/login/login.component';
import {TablesComponent} from "./routes/tables/tables.component";
import {PermissionsComponent} from "./routes/permissions/permissions.component";
import {UserComponent} from "./routes/user/user.component";
import {NewTableComponent} from "./routes/new-table/new-table.component";
import {TableViewComponent} from "./routes/table-view/table-view.component";
import {SystemInfoComponent} from "./routes/system-info/system-info.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'tables', component: TablesComponent},
  {path: 'new-table', component: NewTableComponent},
  {path: 'view-table', component: TableViewComponent},
  {path: 'permissions', component: PermissionsComponent},
  {path: 'user', component: UserComponent},
  {path: 'system-information', component: SystemInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
