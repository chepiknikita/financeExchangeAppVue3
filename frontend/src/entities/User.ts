import type { IAsset } from "./Asset";
import { Asset } from "./Asset";

export interface UserAsset {
  id: number;
  userId: number;
  assetId: number;
  asset: IAsset;
  averageBuyPrice: number;
  quantity: number;
}

export interface IUser {
  id: number;
  login: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  role: string;
  assets?: UserAsset[];

}

export class User implements IUser {
  id: number;
  login: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  role: string;
  assets: UserAsset[];
  mappedAssets: Asset[];
  

  constructor(data: IUser) {
    this.id = data.id;
    this.login = data.login;
    this.name = data.name;
    this.initialBalance = data.initialBalance;
    this.currentBalance = data.currentBalance;
    this.role = data.role;
    this.assets = data.assets ?? [];
    this.mappedAssets = this.getAssets();
  }

  public setUserAssets(data: UserAsset[]) {
    this.assets = data;
    this.mappedAssets = this.getAssets();
  }

  public getAssets(): Asset[] {
    return Asset.mapUserAssetsToAssets(this.assets);
  }

  public getQuantityByAssetId(id: number) {
    return this.assets.find((asset) => asset.assetId === id)?.quantity ?? 0;
  }

  public calculateTotalBalance() {
    return this.mappedAssets.reduce((acc, v) => acc + (v.price * v.quantity), 0) + this.currentBalance;
  }

  public calculateProfitPercentage() {
    const totalBalance = this.calculateTotalBalance();
    const profit = totalBalance - this.initialBalance;
    return (profit/this.initialBalance) * 100;
  }
}
