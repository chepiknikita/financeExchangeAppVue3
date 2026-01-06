import type { AxiosInstance, AxiosResponse } from "axios";
import type { OrderRequest } from "@/entities/Order";

export default class OrderEndpoint {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAll<T>(): Promise<AxiosResponse<T>> {
    return await this.api.get("orders");
  }

  async getUserOrders<T>(userId: number): Promise<AxiosResponse<T>> {
    return await this.api.get(`orders/${userId}`);
  }

  async create<T>(payload: OrderRequest): Promise<AxiosResponse<T>> {
    return await this.api.post("orders", payload);
  }
}
