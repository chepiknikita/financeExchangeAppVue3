import type { AxiosInstance } from "axios";
import ApiClient from "./config/ApiClient";
import UserEndpoint from "./endpoints/UserEndpoint";
import UserRepository from "./repositories/UserRepository";
import { UserService } from "./services/UserService";
import AssetsRepository from "./repositories/AssetsRepository";
import AssetsEndpoint from "./endpoints/AssetsEndpoint";
import { AssetsService } from "./services/AssetsService";
import { ExchangeService } from "./services/ExchangeService";
import ExchangeRepository from "./repositories/ExchangeRepository";
import ExchangeEndpoint from "./endpoints/ExchangeEndpoint";
import OrderEndpoint from "./endpoints/OrderEndpoint";
import OrderRepository from "./repositories/OrderRepository";
import { OrderService } from "./services/OrderService";
import { WebSocketService } from "./services/WebSocketService";

const API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:8080";

export class ApiFactory {
  private static apiClient: AxiosInstance;

  private static initialize() {
    if (!this.apiClient) {
      this.apiClient = new ApiClient(API_URL).api;
    }
  }

  public static createUserService(): UserService {
    this.initialize();
    const repository = new UserRepository(new UserEndpoint(this.apiClient));
    return new UserService(repository);
  }

  public static createAssetsService(): AssetsService {
    this.initialize();
    const repository = new AssetsRepository(new AssetsEndpoint(this.apiClient));
    return new AssetsService(repository);
  }

  public static createExchangeService(): ExchangeService {
    this.initialize();
    const repository = new ExchangeRepository(
      new ExchangeEndpoint(this.apiClient)
    );
    return new ExchangeService(repository);
  }

  public static createOrderService(): OrderService {
    this.initialize();
    const repository = new OrderRepository(new OrderEndpoint(this.apiClient));
    return new OrderService(repository);
  }

  public static createWebSocketService(): WebSocketService {
    return WebSocketService.getInstance();
  }
}
