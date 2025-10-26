import type { AxiosResponse } from "axios";
import type OrderEndpoint from "../endpoints/OrderEndpoint";
import type { Order, OrderCreate } from "../intarfaces/order";

export default class OrderRepository {
  api: OrderEndpoint;

  constructor(api: OrderEndpoint) {
    this.api = api;
  }

  async getAll(): Promise<AxiosResponse<Order[]>> {
    return this.api.getAll<Order[]>();
  }

  async getUserOrders(id: number): Promise<AxiosResponse<Order>> {
    return this.api.getUserOrders<Order>(id);
  }

  async create(payload: OrderCreate): Promise<AxiosResponse<Order>> {
    return this.api.create<Order>(payload);
  }
}