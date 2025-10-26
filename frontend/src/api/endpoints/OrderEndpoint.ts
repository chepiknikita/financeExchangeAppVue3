import type { AxiosInstance, AxiosResponse } from "axios";
import type { OrderCreate } from "../intarfaces/order";

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
  
    async create<T>(payload: OrderCreate): Promise<AxiosResponse<T>> {
      return await this.api.post("orders", payload);
    }
}