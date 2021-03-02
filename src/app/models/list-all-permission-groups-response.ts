import {PermissionModel} from "./permission-model";

export interface ListAllPermissionGroupsResponse {
  message: string;
  permission_groups: PermissionModel[];
  alert: string;
}
