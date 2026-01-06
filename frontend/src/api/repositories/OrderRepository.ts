import type { AxiosResponse } from "axios";
import type OrderEndpoint from "../endpoints/OrderEndpoint";
import type { IOrder, OrderRequest } from "@/entities/Order";

export default class OrderRepository {
  api: OrderEndpoint;

  constructor(api: OrderEndpoint) {
    this.api = api;
  }

  async getAll(): Promise<AxiosResponse<IOrder[]>> {
    return this.api.getAll<IOrder[]>();
  }

  async getUserOrders(id: number): Promise<AxiosResponse<IOrder>> {
    return this.api.getUserOrders<IOrder>(id);
  }

  async create(payload: OrderRequest): Promise<AxiosResponse<IOrder>> {
    return this.api.create<IOrder>(payload);
  }
}
