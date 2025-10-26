import type { Order, OrderCreate } from "../intarfaces/order";
import type OrderRepository from "../repositories/OrderRepository";

export class UserService {
  constructor(private repository: OrderRepository) {}

  async getAll(): Promise<Order[]> {
    try {
      const users = (await this.repository.getAll()).data;
      return users;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getUserOrders(id: number): Promise<Order | null> {
    try {
      const user = (await this.repository.getUserOrders(id)).data;
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(payload: OrderCreate): Promise<Order | null> {
    try {
      const order = (await this.repository.create(payload)).data;
      return order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
