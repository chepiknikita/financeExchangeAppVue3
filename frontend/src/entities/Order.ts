import type { Asset, IAsset } from "./Asset";
import type { User } from "./User";

export const enum OrderType {
  Buy = "BUY",
  Sell = "SELL",
}

export interface OrderRequest {
  userId: number;
  assetId: number;
  quantity: number;
  type: OrderType;
}

export interface IOrder {
  id: number;
  type: OrderType;
  quantity: number;
  price: number;
  asset: IAsset;
  createdAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
  };
}

export class Order implements IOrder {
  id: number;
  type: OrderType;
  quantity: number;
  price: number;
  asset: IAsset;
  createdAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
  };

  constructor(data: IOrder) {
    this.id = data.id;
    this.type = data.type;
    this.quantity = data.quantity;
    this.price = data.price;
    this.asset = data.asset;
    this.createdAt = data.createdAt;
    this.userId = data.userId;
    this.user = data.user;
  }

  static getOrderRequest(
    type: OrderType,
    user: User | null,
    asset: Asset | null,
    quantity?: string
  ): OrderRequest | null {
    if (!user || !asset || !quantity) return null;
    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) return null;
    return {
      userId: user.id,
      assetId: asset.id,
      type,
      quantity: parsedQuantity,
    };
  }
}
