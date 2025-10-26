import type { AxiosResponse } from "axios";
import type AssetsEndpoint from "../endpoints/AssetsEndpoint";
import type { Asset, PriceHistory, UserAsset } from "../intarfaces/asset";

export default class AssetsRepository {
  api: AssetsEndpoint;

  constructor(api: AssetsEndpoint) {
    this.api = api;
  }

  async getAll(): Promise<AxiosResponse<Asset[]>> {
    return this.api.getAll<Asset[]>();
  }

  async getById(id: number): Promise<AxiosResponse<Asset>> {
    return this.api.getById<Asset>(id);
  }

  async getAssetHistory(id: number): Promise<AxiosResponse<PriceHistory[]>> {
    return this.api.getAssetHistory<PriceHistory[]>(id);
  }

  async getUserPortfolio(userId: number): Promise<AxiosResponse<UserAsset[]>> {
    return this.api.getUserPortfolio<UserAsset[]>(userId);
  }

  async getProfitLoss(userId: number): Promise<AxiosResponse<{ [key: number]: number }>> {
    return this.api.getProfitLoss<{ [key: number]: number }>(userId);
  }
}
