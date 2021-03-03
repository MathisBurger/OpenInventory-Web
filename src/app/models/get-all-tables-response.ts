import {TableModel} from "./table-model";

export interface GetAllTablesResponse {
  message: string;
  alert: string;
  tables: TableModel[];
}
