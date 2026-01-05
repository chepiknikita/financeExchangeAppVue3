import { formatMoneyAmount } from "@/utilities/helpers";
import type { UserAsset } from "./User";

export const enum AssetType {
  Stock = "stock",
  Metal = "metal",
  Empty = "",
}

export interface IAsset {
  id: number;
  ticker: string;
  name: string;
  type: AssetType;
  price: number;
  closingPrice: number;
  averageBuyPrice: number;
  quantity: number;
  availableQuantity: number;
  history?: PriceHistory[];
}

export interface PriceHistory {
  id: number;
  assetId: number;
  price: number;
  timestamp: Date;
}

export class Asset implements IAsset {
  id: number;
  ticker: string;
  name: string;
  type: AssetType;
  price: number;
  closingPrice: number;
  averageBuyPrice: number;
  quantity: number;
  availableQuantity: number;
  history: PriceHistory[];

  constructor(data: IAsset) {
    this.id = data.id;
    this.ticker = data.ticker;
    this.name = data.name;
    this.type = data.type;
    this.price = data.price ?? 0;
    this.closingPrice = data.closingPrice ?? 0;
    this.averageBuyPrice = data.averageBuyPrice ?? 0;
    this.quantity = data.quantity ?? 0;
    this.availableQuantity = data.availableQuantity ?? 0;
    this.history = data.history ?? [];
  }

  public setHistory(data: PriceHistory[]) {
    this.history = data;
  }

  public getProfit() {
    return this.price - this.closingPrice;
  }

  public getProfitPercent() {
    return ((this.price - this.closingPrice)/this.price) * 100
  }

  public getTotalProfit() {
    return (this.price - this.averageBuyPrice) * this.quantity;
  }

  static getFormatMoney(value: number, fixed = 2) {
    return +formatMoneyAmount(value.toFixed(fixed));
  }

  static mapUserAssetsToAssets(value: UserAsset[]) {
    return value.map((v) => {
      return new Asset({
        ...v.asset,
        quantity: v.quantity,
        averageBuyPrice: v.averageBuyPrice,
      });
    });
  }
}
