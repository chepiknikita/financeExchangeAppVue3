import type { AxiosResponse } from "axios";
import type AssetsEndpoint from "../endpoints/AssetsEndpoint";
import type { IAsset, PriceHistory } from "@/entities/Asset";
import type { UserAsset } from "@/entities/User";

export default class AssetsRepository {
  api: AssetsEndpoint;

  constructor(api: AssetsEndpoint) {
    this.api = api;
  }

  async getAll(): Promise<AxiosResponse<IAsset[]>> {
    return this.api.getAll<IAsset[]>();
  }

  async getById(id: number): Promise<AxiosResponse<IAsset>> {
    return this.api.getById<IAsset>(id);
  }

  async getAssetHistory(id: number): Promise<AxiosResponse<PriceHistory[]>> {
    return this.api.getAssetHistory<PriceHistory[]>(id);
  }

  async getUserPortfolio(userId: number): Promise<AxiosResponse<UserAsset[]>> {
    return this.api.getUserPortfolio<UserAsset[]>(userId);
  }
}
