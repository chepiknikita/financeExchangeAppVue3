import type { UserAsset } from "./asset";
import type { Order } from "./order";

export interface UserInfoEdit {
  balance: number;
}

export interface User {
  id: number;
  login: string;
  name: string;
  balance: string;
  role: string;
  assets?: UserAsset[];
  orders?: Order[];
}
