import {UserModel} from "./user-model";

export interface ListUserResponse {
  message: string;
  alert: string;
  user: UserModel[];
}
