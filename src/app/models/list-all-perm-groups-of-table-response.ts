import {PermissionModel} from "./permission-model";

export interface ListAllPermGroupsOfTableResponse {
  perm_groups: PermissionModel[];
  message: string;
  alert: string;
}
