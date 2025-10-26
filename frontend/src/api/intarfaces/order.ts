import type { Asset } from "./asset";

export interface Order {
  id: number;
  userId: number;
  type: string;
  quantity: number;
  price: number;
  status: string;
  createdAt: string;
  asset: Asset;
  user: {
    id: number;
    name: string;
  };
}

export interface OrderCreate {
  userId: number;
  assetId: number;
  type: string; //TODO enum
  quantity: number;
}
