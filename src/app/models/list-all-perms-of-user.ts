import {PermissionModel} from "./permission-model";

export interface ListAllPermsOfUser {
  message: string;
  permissions: PermissionModel[];
  status: string;
  http_status: number;
  alert: string;
}
