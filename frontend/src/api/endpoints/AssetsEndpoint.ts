import type { AxiosInstance, AxiosResponse } from "axios";

export default class AssetsEndpoint {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAll<T>(): Promise<AxiosResponse<T>>{
    return this.api.get("assets");
  }

  async getById<T>(id: number): Promise<AxiosResponse<T>> {
    return this.api.get(`assets/${id}`);
  }

  async getAssetHistory<T>(id: number): Promise<AxiosResponse<T>> {
    return this.api.get(`assets/${id}/history`);
  }

  async getUserPortfolio<T>(userId: number): Promise<AxiosResponse<T>> {
    return this.api.get(`assets/portfolio/${userId}`);
  }

  async getProfitLoss<T>(userId: number): Promise<AxiosResponse<T>> {
    return this.api.get(`assets/profit-loss/${userId}`);
  }
}
