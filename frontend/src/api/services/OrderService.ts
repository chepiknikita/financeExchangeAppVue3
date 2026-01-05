import type { IOrder, OrderRequest } from "@/entities/Order";
import type OrderRepository from "../repositories/OrderRepository";
import { handleApiError } from "../utils/handlerError";

export class OrderService {
  constructor(private repository: OrderRepository) {}

  async getAll(): Promise<IOrder[]> {
    try {
      const users = (await this.repository.getAll()).data;
      return users;
    } catch (error) {
      handleApiError(error);
      return [];
    }
  }

  async getUserOrders(id: number): Promise<IOrder | null> {
    try {
      const user = (await this.repository.getUserOrders(id)).data;
      return user;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  async create(payload: OrderRequest): Promise<IOrder | null> {
    try {
      const order = (await this.repository.create(payload)).data;
      return order;
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }
}
