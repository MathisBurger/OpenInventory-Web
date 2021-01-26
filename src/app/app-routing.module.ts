import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {TablesComponent} from "./tables/tables.component";
import {PermissionsComponent} from "./permissions/permissions.component";
import {UserComponent} from "./user/user.component";
import {NewTableComponent} from "./new-table/new-table.component";
import {TableViewComponent} from "./table-view/table-view.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'tables', component: TablesComponent},
  {path: 'new-table', component: NewTableComponent},
  {path: 'view-table', component: TableViewComponent},
  {path: 'permissions', component: PermissionsComponent},
  {path: 'user', component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
